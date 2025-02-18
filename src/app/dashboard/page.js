'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'

export default function Dashboard() {
    const router = useRouter()
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        if (!localStorage.getItem('userData')) {
            router.push('/')
        } else {
            setUserData(JSON.parse(localStorage.getItem('userData')));
        }
    }, []);

    const logout = () => {
        localStorage.clear();
        router.push('/')
    }

    return (
        <div className="bg-base-200 min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold">Stock Management</h1>
            {
                userData.role == 'admin' ?
                    <>
                        <button className="btn  w-2/3 mt-4  btn-active btn-ghost" onClick={() => router.push('/addstock')}>เพิ่มสินค้า</button>
                        <button className="btn  w-2/3 mt-4  btn-active btn-ghost" onClick={() => router.push('/deletestock')}>เบิกสินค้า</button>
                        <button className="btn  w-2/3 mt-4  btn-active btn-ghost" onClick={() => router.push('/checkstock')}>เช็ค Stock</button>
                    </> :
                    userData.role == 'import' ?
                        <>
                            <button className="btn  w-2/3 mt-4  btn-active btn-ghost" onClick={() => router.push('/addstock')}>เพิ่มสินค้า</button>
                            <button className="btn  w-2/3 mt-4  btn-active btn-ghost" onClick={() => router.push('/checkstock')}>เช็ค Stock</button>
                        </> : <>

                            <button className="btn  w-2/3 mt-4  btn-active btn-ghost" onClick={() => router.push('/deletestock')}>เบิกสินค้า</button>
                            <button className="btn  w-2/3 mt-4  btn-active btn-ghost" onClick={() => router.push('/checkstock')}>เช็ค Stock</button>
                        </>
            }

            <button className="btn  w-2/3 mt-8  btn-active btn-ghost" onClick={() => logout()}>ออกจากระบบ</button>
        </div>
    );
}
