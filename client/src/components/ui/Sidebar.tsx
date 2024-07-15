import { Sidebar } from "flowbite-react";
import NavLink from "./NavLink";
import '@/styles/Sidebar.css';
import { MdManageAccounts, MdVideoCameraFront } from "react-icons/md";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import { FaRegNewspaper } from "react-icons/fa6";
import { FaUserFriends } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { countNotification } from "@/Services/notification.api";
import { useContext } from "react";
import { AppContext } from "@/Context/Context";
import { BsPersonFillAdd } from "react-icons/bs";
import { PiUserListFill } from "react-icons/pi";
export default function SideBar() {
  const {user_id} = useContext(AppContext);
  const {data, isLoading, error} = useQuery({
        queryKey:['message_noti'],
        queryFn: ()=>countNotification({user_id:user_id, type:"message"}),
        enabled:!!user_id,
    })
  let message_noti = data?.data;
  return (
    <>
    <Sidebar className="h-screen fixed transition-all sm:translate-x-0 -translate-x-full" aria-label="Sidebar with content separator example">
      <Sidebar.Items className="mt-16">
        <Sidebar.ItemGroup>
          <NavLink href="/profile" className="sidebar-items text-start flex rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            <MdManageAccounts/> Tài khoản
          </NavLink>
          <NavLink href="/chat" className="sidebar-items flex rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
            <IoChatbubbleEllipses/> Trò chuyện 
            {message_noti && 
              <div className='w-5 h-5 flex items-center justify-center rounded-full bg-red-600 relative mt-1 ml-16 text-xs text-white'>{String(message_noti)}</div>
            }
          </NavLink>
          <NavLink href="/blog" className="sidebar-items flex rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
           <FaRegNewspaper/> Bài đăng
          </NavLink>
          <NavLink href="/meeting" className="sidebar-items flex rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
           <MdVideoCameraFront/> Phòng họp
          </NavLink>
          <NavLink href="/schedule" className="sidebar-items flex rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
           <FaCalendarAlt/> Lịch trình
          </NavLink>
          <hr/>
          <Sidebar.Collapse icon={FaUserFriends} label="Bạn bè">
            <NavLink href="/friends" className="sidebar-items flex rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
              <BsPersonFillAdd/> Lời mời kết bạn
            </NavLink>
            <NavLink href="/friends/list" className="sidebar-items flex rounded-lg p-2 text-base font-normal text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
              <PiUserListFill/> Tất cả bạn bè
            </NavLink>
          </Sidebar.Collapse>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
    </>
  )
}
