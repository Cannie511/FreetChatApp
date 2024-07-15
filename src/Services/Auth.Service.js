const { createKey, createRefreshKey, checkKey } = require("./jwt");
const Model = require('../models');
const { checkPassword } = require("../Utils/HashPassword");
const { handleResult, handleError } = require("../Utils/Http");
const { jwtDecode } = require("jwt-decode");
const { addUsersGoogleService } = require("./Google.Service");
const { deleteSessionService } = require("./Session.Service");
const checkEmailService = async(email)=>{
  try {
    if(!email) handleResult(422,'Email is required');
    const account_user = await Model.User.findOne({
      where: {
        email: email,
        linked_account:"verify"
      },
      raw: true,
    });
    if(account_user) return handleResult(200, 'get Email successfully');
    return handleResult(422, "Email not found");
  } catch (error) {
    return handleError(error)
  }
}

const checkSessionService = async(token)=>{
  try {
    if(!token) return handleResult(422, "Token not found");
    const data = await checkKey(token)
    if(data) return handleResult(200, "Session is valid");
    else return handleResult(401, "Unauthorized");
  } catch (error) {
    return handleError(error);
  }
}

const GoogleLoginService = async(token) =>{
  try {
    if(!token) return handleResult(422, "Token not found");
    const data = await jwtDecode(token);
    if (data)
    {
      const account_user = await Model.User.findOne({
        attributes: [
          "id",
          "email",
          "display_name",
          "language",
          "premium",
          "linked_account",
          "avatar"
        ],
        where: {
          email: data.email,
          linked_account: "google",
        },
        raw: true,
      });
      
      if(account_user) 
      {
        const updateGoogleAccount = await Model.User.update(
          {
            email: data?.email,
            display_name: data?.name,
            language: account_user?.language,
            premium: account_user?.premium,
            linked_account: "google",
            avatar: data?.picture,
          },
          {
            where: {
              id: account_user?.id,
            },
            raw: true,
          }
        );
        if (+updateGoogleAccount === 1) {
          const access_token = await createKey({
            id: account_user?.id,
            email: account_user?.email,
            display_name: account_user.display_name,
          });
          const refresh_token = await createRefreshKey({
            id: account_user.id,
            email: account_user.email,
            display_name: account_user.display_name,
          });
          return handleResult(200, "Đăng nhập với Google thành công", {
            access_token,
            refresh_token,
            data: {
              id: account_user?.id,
              email: data?.email,
              display_name: data?.name,
              language: account_user?.language,
              premium: account_user?.premium,
              linked_account: "google",
              avatar: data?.picture,
            },
          });
        }
        return handleResult(422, "Đăng nhập với Google thất bại");
      }
      else {
        const res = await addUsersGoogleService(
          data?.email,
          "",
          data?.name,
          1,
          0,
          "google",
          data?.picture
        );
        console.log(res);
        if(res.status===200){
          const access_token = await createKey({
            id: res?.data.data.id,
            email: res?.data.data.email,
            display_name: res.data.data.display_name,
          });
          const refresh_token = await createRefreshKey({
            id: res.data.data.id,
            email: res.data.data.email,
            display_name: res.data.data.display_name,
          });
          return handleResult(res.status, res.message, {access_token, refresh_token ,data: res.data.data});
        } 
      }
    }
    else return handleResult(401, "Unauthorized");
  } catch (error) {
    return handleError(error);
  }
}

const LoginService = async (username, password)=>{
  try {
    if (!username || !password) {
      return handleResult(422, "username or password is required");
    }
    const account_user = await Model.User.findOne({
      where: {
        email: username,
        linked_account:"verify"
      },
      raw: true,
    });
    if (account_user) {
      if(checkPassword(password, account_user.password)){
          const access_token = await createKey({id:account_user.id, email:account_user.email, display_name: account_user.display_name});
          const refresh_token = await createRefreshKey(
            {
              id: account_user.id,
              email: account_user.email,
              display_name: account_user.display_name,
            }
          );
          return {
            status: 200,
            message: "Login successfully",
            access_token: access_token.token,
            refresh_token: refresh_token.token,
            data: {
              id: account_user?.id,
              email: account_user?.email,
              display_name: account_user?.display_name,
              language: account_user?.language,
              premium: account_user?.premium,
              linked_account: account_user?.linked_account,
              avatar: account_user?.avatar,
            },
          };
        }
        else{
            return handleResult(422, "username or password is incorrect");
        }
      }

  } catch (error) {
      return handleError(error);
  }
}

const LogoutService = async(token, user_id)=>{
  try {
    const id = +user_id;
    const session = await Model.Session.findOne({
      where: {
        user_id: id,
      },
      raw:true
    });
    if (session){
      const data = await deleteSessionService(session?.user_id, token)
      if(data.status !== 200) return handleResult(400, "Log out failed");
      else return handleResult(200, "Log out successfully");
    }
    return handleResult(200, "force log out from server");
  } catch (error) {
    return handleError(error);
  }
}

module.exports = {
  LoginService,
  checkEmailService,
  checkSessionService,
  GoogleLoginService,
  LogoutService,
};