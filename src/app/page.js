'use client'

import React, { useEffect } from 'react';
import supabase from './supabase-client';
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    localStorage.clear();
  }, []);

  const login = async () => {
    let { data: users, error } = await supabase
      .from('users')
      .select("username,name,role")
      // Filters
      .eq('username', document.getElementById('username').value)
      .eq('password', document.getElementById('password').value)

    if (error) {
      alert("Error fetching: " + error);
    } else {
      if (users.length > 0) {
        localStorage.setItem("userData", JSON.stringify(users[0]));
        router.push('/dashboard')
      }
      else {
        document.getElementById('modal_login').showModal();
      }
    }
  };

  return (
    <>
      <div className="bg-base-200 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">Stock Management</h1>
        <input type="text" placeholder="ชื่อผู้ใช้" id="username" className="input input-bordered w-full max-w-xs mt-4" />
        <input type="password" placeholder="พาสเวิร์ด" id='password' className="input input-bordered w-full max-w-xs mt-4" />
        <button className="btn  sm:btn-sm md:btn-md lg:btn-lg w-2/3 mt-4 p-6 btn-active btn-ghost" onClick={() => login()}>เข้าสู่ระบบ</button>
      </div>

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
