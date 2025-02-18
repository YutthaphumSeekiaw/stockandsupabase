'use client'

import React, { useEffect, useState } from 'react';
import supabase from '../supabase-client';

export default function DeleteStock() {
    const [data, setData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [barcode, setBarcode] = useState('');
    const [textAlert, setTextAlert] = useState('');
    const [emp, setEmp] = useState('');
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (!localStorage.getItem('userData')) {
            router.push('/')
        } else {
            setUserData(JSON.parse(localStorage.getItem('userData')));
        }
    }, []);

    useEffect(() => {
    }, [total]);
    useEffect(() => {
    }, [barcode]);
    useEffect(() => {
    }, [emp]);

    const search = async () => {
        if (barcode == '') {
            //alert("กรุณาระบุรหัสสินค้า");
            return;
        }

        let { data: stock, error } = await supabase
            .from('stock')
            .select("product_id,product_name,product_total")
            .eq('product_id', document.getElementById('search').value)

        if (error) {
            alert("Error fetching: " + error);
        } else {
            setTotal(0);
            setData(stock);
        }
    };

    const delStock = async () => {
        if (data.length == 0) {
            setTextAlert("ไม่พบสินค้า กรุณาตรวจสอบรหัสสินค้าอีกครั้ง");
            document.getElementById('modalDelete').showModal();
            return
        }
        if (total == 0) {
            setTextAlert("กรุณาระบุจำนวนเบิกสินค้า");
            document.getElementById('modalDelete').showModal();
            return
        }
debugger
        const { data: stock, error } = await supabase
            .from('stock')
            .update({ product_total: parseInt(data[0].product_total) - parseInt(total) })
            .eq('product_id', data[0].product_id)
            .select('product_id')

        if (error) {
            alert("Error fetching: " + error);
        } else {
            if (stock.length > 0) {
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

                if (error) {
                    alert("Error fetching: " + error);
                } else {
                    if (importData.length > 0) {
                        setBarcode('');
                        setEmp('');
                        setData([]);
                        setTotal(0);
                        setTextAlert("เบิกสินค้าเรียบร้อย");
                        document.getElementById('modalDelete').showModal();
                    } else {
                        setBarcode('');
                        setEmp('');
                        setData([]);
                        setTotal(0);
                        setTextAlert("เบิกสินค้าไม่สำเร็จ");
                        document.getElementById('modalDelete').showModal();
                    }
                }

            } else {
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