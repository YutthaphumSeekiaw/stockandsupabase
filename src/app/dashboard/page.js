'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'

export default function Dashboard() {
    //ประกาศตัวแปร
    const router = useRouter()
    const [userData, setUserData] = useState([]);

    //โหลดข้อมูลเมื่อเปิดหน้าเว็บครั้งแรก
    useEffect(() => {
        //เช็คว่ามีข้อมูลใน localStorage หรือไม่ ถ้าไม่มีให้เปลี่ยนหน้าไปที่หน้า login
        if (!localStorage.getItem('userData')) {
            router.push('/')
        } else {
            //ถ้ามีข้อมูลใน localStorage ให้เก็บข้อมูลในตัวแปร userData 
            setUserData(JSON.parse(localStorage.getItem('userData')));
        }
    }, []);

    //ออกจากระบบ function
    const logout = () => {
        //ลบข้อมูลใน localStorage และเปลี่ยนหน้าไปที่หน้า login
        localStorage.clear();
        router.push('/')
    }

    //ส่วนของหน้าเว็บ
    return (
        <div className="bg-base-200 min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold">Stock Management</h1>
            {
                //เช็คว่าเป็น admin หรือ import หรือ export หรือไม่
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
            {/* //ปุ่มออกจากระบบ */}
            <button className="btn  w-2/3 mt-8  btn-active btn-ghost" onClick={() => logout()}>ออกจากระบบ</button>
        </div>
    );
}
