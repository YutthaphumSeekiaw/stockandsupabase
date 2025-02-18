'use client'

import React, { useEffect, useState } from 'react';

import supabase from '../supabase-client';

export default function DeleteStock() {
    const [data, setData] = useState([]);
    function delStock() {
        document.getElementById('my_modal_6').showModal();
    }

    const search = async () => {
        if(document.getElementById('search').value == ''){
            //alert("กรุณาระบุรหัสสินค้า");
            return;
        }

        let { data: stock, error } = await supabase
          .from('stock')
          .select("product_id,product_name,product_total")
          .eq('product_id',  document.getElementById('search').value)
    
        if (error) {
          alert("Error fetching: " + error);
        } else {
          console.log(stock); 
          setData(stock);
        }
    };

    const [todoList, setTodoList] = useState([]);
    const [newTodo, setNewTodo] = useState("");

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {

        // let { data: users, error } = await supabase
        // .from('users')
        // .select('*')


        let { data: users, error } = await supabase
            .from('users')
            .select("username")
            // Filters
            .eq('username', 'admin')
            .eq('password', 'P@ssw0rd')

        console.log(users);
        if (error) {
            console.log("Error fetching: ", error);
        } else {
            //setTodoList(data);
            console.log(users);
        }
    };

    return (
        <>

            <div className="bg-base-200 min-h-screen">

                <div className="navbar bg-base-100">
                    <div className="navbar-start">
                    </div>
                    <div className="navbar-center">
                        <a className="btn btn-ghost text-xl">เบิกสินค้า</a>
                    </div>
                    <div className="navbar-end">
                        <button className="btn btn-active btn-ghost" onClick={() => window.location.href = '/'}>กลับ</button>
                    </div>
                </div>

                <div className='pl-4 pr-4 pb-6'>

                    <div className="join p-4">
                        <input type="number" id="search" className="input input-bordered join-item" placeholder="รหัสสินค้า" />
                        <button className="btn join-item rounded-r-full btn-active btn-ghost" onClick={() =>search()}>ค้นหา</button>
                    </div>
                    <p className='pb-4'>สินค้า : {data.length == 0 ?<></> : data[0].product_name}</p>
                    <p className='pb-4'>สินค้าคงคลัง : {data.length == 0 ?<></> : data[0].product_total}</p>
                    <div>
                        <span><h1>เบิกจำนวน :</h1></span><input type="number" placeholder="ระบุ" className="input input-bordered w-full max-w-xs" />
                    </div>

                    <p className='pb-4 pt-4'>โดยพนักงาน : user1</p>

                    <button className="btn btn-active btn-ghost sm:btn-sm md:btn-md lg:btn-lg w-full p-6 " onClick={() => delStock()}>เบิกสินค้า</button>


                </div>

            </div>
            <dialog id="my_modal_6" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h1 className="py-4">เพิ่มสินค้าเรียบร้อย</h1>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">ปิด</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
}