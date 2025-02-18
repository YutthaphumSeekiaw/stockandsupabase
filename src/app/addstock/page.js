'use client'

import React, { use, useEffect, useState } from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import supabase from '../supabase-client';

export default function AddStock() {
    const [data, setData] = useState([]);
    const [barcode, setBarcode] = useState('');
    const [btnScan, setBtnScan] = useState('N');

    function showAddStock() {
        setBtnScan('N');
        document.getElementById('my_modal_5').showModal();
    }

    useEffect(() => {
        //search()
    }, [barcode]);

    const search = async () => {
        if (barcode == '') {
            //alert("กรุณาระบุรหัสสินค้า");
            return;
        }
        let { data: stock, error } = await supabase
            .from('stock')
            .select("product_id,product_name,product_total")
            .eq('product_id', barcode)

        if (error) {
            alert("Error fetching: " + error);
        } else {
            setData(stock);
        }
    };

    const searchBarcode = async (param) => {
        if (param == '') {
            //alert("กรุณาระบุรหัสสินค้า");
            return;
        }
        let { data: stock, error } = await supabase
            .from('stock')
            .select("product_id,product_name,product_total")
            .eq('product_id', param)

        if (error) {
            alert("Error fetching: " + error);
        } else {
            setData(stock);
        }
    };

    return (
        <>
            <div className="bg-base-200 min-h-screen">
                <div className="navbar bg-base-100">
                    <div className="navbar-start">
                    </div>
                    <div className="navbar-center">
                        <a className="btn btn-ghost text-xl">เพิ่มสินค้า</a>
                    </div>
                    <div className="navbar-end">
                        <button className="btn btn-active btn-ghost" onClick={() => window.location.href = '/'}>กลับ</button>
                    </div>
                </div>

                {
                    btnScan == 'Y' ?
                        <>
                            <BarcodeScannerComponent
                                // width={500}
                                // height={500}
                                onUpdate={(err, result) => {
                                    if (typeof result !== "undefined") {
                                        setBarcode(result?.text)
                                        searchBarcode(result?.text);
                                        setBtnScan('N')
                                    }
                                    else { setBarcode("no result") }
                                }}
                            />

                            <div className='pl-4 pr-4 pb-6'>
                                <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg w-full mt-2 p-6 btn-active btn-ghost" onClick={() => setBtnScan('N')}>ปิด</button>
                            </div>
                        </>
                        :
                        <>
                            <div className='pl-4 pr-4 pb-6'>
                                <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg w-full mt-2 p-6 btn-active btn-ghost" onClick={() => setBtnScan('Y')}>Scan</button>

                                <div className="join p-4 mt-6">
                                    <input type="number" id="search" className="input input-bordered join-item" placeholder="รหัสสินค้า" value={barcode} onChange={(e) => setBarcode(e.target.value)} />
                                    <button className="btn join-item rounded-r-full btn-active btn-ghost" onClick={() => search()}>ค้นหา</button>
                                </div>
                                <p className='pb-4'>สินค้า : {data.length == 0 ? <></> : data[0].product_name}</p>
                                <p className='pb-4'>สินค้าคงคลัง : {data.length == 0 ? <></> : data[0].product_total}</p>
                                <div>
                                    <span><h1>เพิ่ม stock จำนวน :</h1></span><input type="number" placeholder="ระบุ" className="input input-bordered w-full max-w-xs" />
                                </div>

                                <p className='pb-4 pt-4'>โดยพนักงาน : user1</p>
                                <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg w-full p-6  btn-active btn-ghost" onClick={() => showAddStock()}>เพิ่มสินค้า</button>
                            </div>
                        </>

                }


                <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
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
            </div>
        </>
    );
}

