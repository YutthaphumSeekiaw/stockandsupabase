'use client'

import React, { useEffect, useState } from 'react';
import supabase from '../supabase-client';

export default function DeleteStock() {
    //ประกาศตัวแปร
    const [data, setData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [barcode, setBarcode] = useState('');
    const [textAlert, setTextAlert] = useState('');
    const [emp, setEmp] = useState('');
    const [total, setTotal] = useState(0);

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

    //เช็คว่ามีการเปลี่ยนแปลงข้อมูลหรือไม่ ในช่องกรอกข้อมูลรหัสสินค้า
    useEffect(() => {
    }, [barcode]);
    //เช็คว่ามีการเปลี่ยนแปลงข้อมูลหรือไม่ ในช่องกรอกข้อมูลจำนวนสินค้า
    useEffect(() => {
    }, [total]);
    //เช็คว่ามีการเปลี่ยนแปลงข้อมูลหรือไม่ ในช่องกรอกข้อมูลผู้เบิกสินค้า
    useEffect(() => {
    }, [emp]);

    //function ค้นหาสินค้าจากฐานข้อมูล
    const search = async () => {
        //ถ้าไม่กรอกรหัสสินค้า ให้ return ออกไป ไม่ทำอะไร
        if (barcode == '') {
            return;
        }
        //ดึงข้อมูลสินค้าจากฐานข้อมูล โดยเลือกเฉพาะ product_id,product_name,product_total จากตาราง stock ที่ product_id เท่ากับ รหัสสินค้าที่กรอกมา
        let { data: stock, error } = await supabase
            .from('stock')
            .select("product_id,product_name,product_total")
            .eq('product_id', document.getElementById('search').value)
        //ถ้าเกิด error ให้แสดงข้อความ error
        if (error) {
            alert("Error fetching: " + error);
        } else {
            //เก็บข้อมูลลงตัวแปร data
            setTotal(0);
            setData(stock);
        }
    };

    //function ลบสินค้าจากฐานข้อมูล
    const delStock = async () => {
        //เช็คว่าระบุรหัสสินค้าหรือไม่ ถ้าไม่ให้แสดง dialog แจ้งเตือน กรุณาระบุรหัสสินค้า
        if (data.length == 0) {
            setTextAlert("ไม่พบสินค้า กรุณาตรวจสอบรหัสสินค้าอีกครั้ง");
            document.getElementById('modalDelete').showModal();
            return
        }
        //เช็คว่าระบุจำนวนสินค้าหรือไม่ ถ้าไม่ให้แสดง dialog แจ้งเตือน กรุณาระบุจำนวนเบิกสินค้า 
        if (total == 0) {
            setTextAlert("กรุณาระบุจำนวนเบิกสินค้า");
            document.getElementById('modalDelete').showModal();
            return
        }
        //เช็คจำนวนสินค้าที่ต้องการเบิก ว่ามากกว่าจำนวนสินค้าที่มีหรือไม่ ถ้ามากกว่าให้แสดง dialog แจ้งเตือน จำนวนสินค้าไม่เพียงพอ กับจำนวนที่ต้องการเบิก
        if (parseInt(total) > parseInt(data[0].product_total)) {
            setTextAlert("จำนวนสินค้าไม่เพียงพอ กับจำนวนที่ต้องการเบิก");
            document.getElementById('modalDelete').showModal();
            return
        }
        //เก็บข้อมูล stock ลงในฐานข้อมูล
        const { data: stock, error } = await supabase
            .from('stock')
            .update({ product_total: parseInt(data[0].product_total) - parseInt(total) })
            .eq('product_id', data[0].product_id)
            .select('product_id')
        //เช็ค error ถ้าไม่มี error ให้ไปเก็บข้อมูล export ลงในฐานข้อมูลต่อ
        if (error) {
            alert("Error fetching: " + error);
        } else {
            //เช็คว่าเก็บข้อมูล stock ลงในฐานข้อมูลสำเร็จหรือไม่
            if (stock.length > 0) {
                //เก็บข้อมูล export สำเร็จหรือไม่
                const { data: importData, error } = await supabase
                    .from('export')
                    .insert([
                        {
                            employee_export: emp,
                            employee: userData?.name,
                            product_name: data[0].product_name,
                            stock: parseInt(data[0].product_total),
                            export: parseInt(total),
                            stock_renew: parseInt(data[0].product_total) - parseInt(total),
                        },
                    ])
                    .select('id')
                //เช็ค error ถ้าไม่มี error ให้แสดง dialog แจ้งเตือน เบิกสินค้าเรียบร้อย
                if (error) {
                    alert("Error fetching: " + error);
                } else {
                    //เช็คว่าเก็บข้อมูล export สำเร็จหรือไม่
                    if (importData.length > 0) {
                        //เซตค่าเริ่มต้น เเละ แสดง dialog แจ้งเตือน เบิกสินค้าเรียบร้อย
                        setBarcode('');
                        setEmp('');
                        setData([]);
                        setTotal(0);
                        setTextAlert("เบิกสินค้าเรียบร้อย");
                        document.getElementById('modalDelete').showModal();
                    } else {
                        //เซตค่าเริ่มต้น เเละ แสดง dialog แจ้งเตือน เบิกสินค้าไม่สำเร็จ
                        setBarcode('');
                        setEmp('');
                        setData([]);
                        setTotal(0);
                        setTextAlert("เบิกสินค้าไม่สำเร็จ");
                        document.getElementById('modalDelete').showModal();
                    }
                }

            } else {
                //เซตค่าเริ่มต้น เเละ แสดง dialog แจ้งเตือน เบิกสินค้าไม่สำเร็จ
                setBarcode('');
                setEmp('');
                setData([]);
                setTotal(0);
                setTextAlert("เบิกสินค้าไม่สำเร็จ");
                document.getElementById('modalDelete').showModal();
            }
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
                        <button className="btn btn-active btn-ghost" onClick={() => window.location.href = '/dashboard'}>กลับ</button>
                    </div>
                </div>

                <div className='pl-4 pr-4 pb-6'>

                    <div className="join p-4">
                        <input type="number" id="search" className="input input-bordered join-item" placeholder="รหัสสินค้า" value={barcode} onChange={(e) => setBarcode(e.target.value)} />
                        <button className="btn join-item rounded-r-full btn-active btn-ghost" onClick={() => search()}>ค้นหา</button>
                    </div>
                    <p className='pb-4'>สินค้า : {data.length == 0 ? <></> : data[0].product_name}</p>
                    <p className='pb-4'>สินค้าคงคลัง : {data.length == 0 ? <></> : data[0].product_total}</p>
                    <div>
                        <span><h1>เบิกจำนวน :</h1></span><input type="number" placeholder="ระบุ" className="input input-bordered w-full max-w-xs" value={total} onChange={(e) => setTotal(e.target.value)} />
                    </div>

                    <div className="mt-6">
                        <span><h1>ผู้เบิกสินค้า :</h1></span><input type="text" placeholder="ระบุ" className="input input-bordered w-full max-w-xs" value={emp} onChange={(e) => setEmp(e.target.value)} />
                    </div>
                    <p className='pb-4 pt-4'>โดยพนักงาน : {userData?.name}</p>

                    <button className="btn btn-active btn-ghost w-full" onClick={() => delStock()}>เบิกสินค้า</button>
                </div>

            </div>
            <dialog id="modalDelete" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h1 className="py-4">{textAlert}</h1>
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