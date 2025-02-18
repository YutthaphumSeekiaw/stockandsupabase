'use client'

import React, { useEffect } from 'react';
import supabase from './supabase-client';
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  //โหลดข้อมูลเมื่อเข้ามาหน้านี้
  useEffect(() => {
    localStorage.clear();
  }, []);

  //เข้าสู่ระบบ function
  const login = async () => {
    //ถ้าไม่กรอกชื่อผู้ใช้หรือรหัสผ่าน ให้ return ออกไป ไม่ทำอะไร
    if (document.getElementById('username').value == '' || document.getElementById('password').value == '') {
      return;
    }
    //ดึงข้อมูลผู้ใช้จากฐานข้อมูล
    let { data: users, error } = await supabase
      .from('users')
      .select("username,name,role")
      //เช็คว่ามีชื่อผู้ใช้และรหัสผ่านตรงกับที่กรอกมาหรือไม่
      .eq('username', document.getElementById('username').value)
      .eq('password', document.getElementById('password').value)

    //ถ้าเกิด error ให้แสดงข้อความ error
    if (error) {
      alert("Error fetching: " + error);
    } else {
      //ถ้ามีข้อมูลผู้ใช้ในฐานข้อมูล ให้เก็บข้อมูลผู้ใช้ลง localStorage และเปลี่ยนหน้าไปหน้า dashboard
      if (users.length > 0) {
        localStorage.setItem("userData", JSON.stringify(users[0]));
        router.push('/dashboard')
      }
      else {
        //ถ้าไม่มีข้อมูลผู้ใช้ให้แสดง dialog แจ้งเตือน ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง
        document.getElementById('modal_login').showModal();
      }
    }
  };

  //ส่วนของหน้าเว็บ
  return (
    <>
      <div className="bg-base-200 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Stock Management</h1>
        {/* //input ชื่อผู้ใช้ และ รหัสผ่าน */}
        <input type="text" placeholder="ชื่อผู้ใช้" id="username" className="input input-bordered w-full max-w-xs mt-4" />
        <input type="password" placeholder="พาสเวิร์ด" id='password' className="input input-bordered w-full max-w-xs mt-4" />
        {/* //button เข้าสู่ระบบ */}
        <button className="btn  sm:btn-sm md:btn-md lg:btn-lg w-2/3 mt-4 p-6 btn-active btn-ghost" onClick={() => login()}>เข้าสู่ระบบ</button>
      </div>
      {/* //dialog แจ้งเตือน ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง */}
      <dialog id="modal_login" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h1 className="py-4">ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง</h1>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">ปิด</button>
            </form>
          </div>
        </div>
      </dialog>
    </>

  );
}
