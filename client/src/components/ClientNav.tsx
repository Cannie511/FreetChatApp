'use client'
import React, { Suspense } from 'react'
import Navbar from './ui/Navbar'
import SideBar from './ui/Sidebar'
import { usePathname } from 'next/navigation';
import { authRoute } from '@/middleware';
import Loading from '@/app/loading';
export default function ClientNav({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const pathname = usePathname();
    const isLoginRoute = authRoute.some(path=>pathname.startsWith(path));
  return (
    <>
        {!isLoginRoute ? <>
              <Navbar/>
              <SideBar/>
              <div className="md:p-4 sm:ml-64">
                  <div className="md:p-4 rounded-lg dark:border-gray-700 mt-16">
                    {children}
                  </div>
                </div>
          </>:<>
            {children}
        </>}
        
    </>

  )
}
