'use client'

import React, { use, useEffect, useState } from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import supabase from '../supabase-client';

export default function AddStock() {
    const [data, setData] = useState([]);
    const [barcode, setBarcode] = useState('');
    const [btnScan, setBtnScan] = useState('N');
    const [userData, setUserData] = useState([]);
    const [textAlert, setTextAlert] = useState('');
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (!localStorage.getItem('userData')) {
            router.push('/')
        } else {
            setUserData(JSON.parse(localStorage.getItem('userData')));
        }
    }, []);

    useEffect(() => {
    }, [barcode]);
    useEffect(() => {
    }, [total]);

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
            setTotal(0);
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
            setTotal(0);
            setData(stock);
        }
    };

    const addStock = async () => {
        if (data.length == 0) {
            setTextAlert("ไม่พบสินค้า กรุณาตรวจสอบรหัสสินค้าอีกครั้ง");
            document.getElementById('modalAddStock').showModal();
            return
        }
        if (total == 0) {
            setTextAlert("กรุณาระบุจำนวนสินค้า");
            document.getElementById('modalAddStock').showModal();
            return
        }
        
        const { data: stock, error } = await supabase
            .from('stock')
            .update({ product_total: parseInt(data[0].product_total) + parseInt(total) })
            .eq('product_id', data[0].product_id)
            .select('product_id')

        if (error) {
            alert("Error fetching: " + error);
        } else {
            if (stock.length > 0) {
                const { data: importData, error } = await supabase
                    .from('import')
                    .insert([
                        {
                            employee: userData?.name,
                            product_name: data[0].product_name,
                            stock: parseInt(data[0].product_total),
                            import: parseInt(total),
                            stock_renew: parseInt(data[0].product_total) + parseInt(total),
                        },
                    ])
                    .select('id')

                if (error) {
                    alert("Error fetching: " + error);
                } else {
                    if (importData.length > 0) {
                        setBarcode('');
                        setData([]);
                        setTotal(0);
                        setTextAlert("เพิ่มสินค้าเรียบร้อย");
                        document.getElementById('modalAddStock').showModal();
                    } else {
                        setBarcode('');
                        setData([]);
                        setTotal(0);
                        setTextAlert("เพิ่มสินค้าไม่สำเร็จ");
                        document.getElementById('modalAddStock').showModal();
                    }
                }

            } else {
                setBarcode('');
                setData([]);
                setTotal(0);
                setTextAlert("เพิ่มสินค้าไม่สำเร็จ");
                document.getElementById('modalAddStock').showModal();
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
                        <a className="btn btn-ghost text-xl">เพิ่มสินค้า</a>
                    </div>
                    <div className="navbar-end">
                        <button className="btn btn-active btn-ghost" onClick={() => window.location.href = '/dashboard'}>กลับ</button>
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
                                    else { console.log("cannot detect barcode or qr code") }
                                }}
                            />

                            <div className='pl-4 pr-4 pb-6'>
                                <button className="btn w-full mt-2 p-6 btn-active btn-ghost" onClick={() => setBtnScan('N')}>ปิด</button>
                            </div>
                        </>
                        :
                        <>
                            <div className='pl-4 pr-4 pb-6'>
                                <button className="btn w-full mt-2 p-6 btn-active btn-ghost" onClick={() => setBtnScan('Y')}>Scan</button>

                                <div className="join p-4 mt-6">
                                    <input type="number" id="search" className="input input-bordered join-item" placeholder="รหัสสินค้า" value={barcode} onChange={(e) => setBarcode(e.target.value)} />
                                    <button className="btn join-item rounded-r-full btn-active btn-ghost" onClick={() => search()}>ค้นหา</button>
                                </div>
                                <p className='pb-4'>สินค้า : {data.length == 0 ? <></> : data[0].product_name}</p>
                                <p className='pb-4'>สินค้าคงคลัง : {data.length == 0 ? <></> : data[0].product_total}</p>
                                <div>
                                    <span><h1>เพิ่ม stock จำนวน :</h1></span><input type="number" placeholder="ระบุ" className="input input-bordered w-full max-w-xs" value={total} onChange={(e) => setTotal(e.target.value)} />
                                </div>

                                <p className='pb-4 pt-4'>โดยพนักงาน : {userData?.name}</p>
                                <button className="btn w-full p-6  btn-active btn-ghost" onClick={() => addStock()}>เพิ่มสินค้า</button>
                            </div>
                        </>

                }


                <dialog id="modalAddStock" className="modal modal-bottom sm:modal-middle">
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
            </div>
        </>
    );
}

