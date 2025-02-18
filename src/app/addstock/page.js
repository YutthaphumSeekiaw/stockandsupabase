'use client'

import React, { use, useEffect, useState } from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import supabase from '../supabase-client';

export default function AddStock() {
    //ประกาศตัวแปร
    const [data, setData] = useState([]);
    const [barcode, setBarcode] = useState('');
    const [btnScan, setBtnScan] = useState('N');
    const [userData, setUserData] = useState([]);
    const [textAlert, setTextAlert] = useState('');
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

    //function ค้นหาสินค้าจากฐานข้อมูล จากปุ่มค้นหา
    const search = async () => {
        //เช็คว่ารหัสสินค้าว่างหรือไม่ ถ้าว่างให้ return ออกไป ไม่ทำอะไร
        if (barcode == '') {
            return;
        }
        //ดึงข้อมูลสินค้าจากฐานข้อมูล โดยเลือกเฉพาะ product_id,product_name,product_total จากตาราง stock ที่ product_id เท่ากับ param
        let { data: stock, error } = await supabase
            .from('stock')
            .select("product_id,product_name,product_total")
            .eq('product_id', barcode)
        //เช็ค error ถ้าไม่มี error ให้เซ็ตค่าเริ่มต้น และเก็บข้อมูลลงในตัวแปร data
        if (error) {
            alert("Error fetching: " + error);
        } else {
            //เซ็ตค่าลงในตัวแปร data
            setTotal(0);
            setData(stock);
        }
    };

    //function ค้นหาสินค้าจากฐานข้อมูล จากการสแกน
    const searchBarcode = async (param) => {
        //เช็คว่ารหัสสินค้าว่างหรือไม่ ถ้าว่างให้ return ออกไป ไม่ทำอะไร
        if (param == '') {
            return;
        }
        //ดึงข้อมูลสินค้าจากฐานข้อมูล โดยเลือกเฉพาะ product_id,product_name,product_total จากตาราง stock ที่ product_id เท่ากับ param
        let { data: stock, error } = await supabase
            .from('stock')
            .select("product_id,product_name,product_total")
            .eq('product_id', param)
        //เช็ค error ถ้าไม่มี error ให้เซ็ตค่าเริ่มต้น และเก็บข้อมูลลงในตัวแปร data
        if (error) {
            alert("Error fetching: " + error);
        } else {
            //เซ็ตค่าลงในตัวแปร data
            setTotal(0);
            setData(stock);
        }
    };

    //function เพิ่มสินค้า
    const addStock = async () => {
        //เช็คว่าระบุรหัสสินค้าหรือไม่ ถ้าไม่ให้แสดง dialog แจ้งเตือน
        if (data.length == 0) {
            setTextAlert("ไม่พบสินค้า กรุณาตรวจสอบรหัสสินค้าอีกครั้ง");
            document.getElementById('modalAddStock').showModal();
            return
        }
        //เช็คว่าระบุจำนวนสินค้าหรือไม่ ถ้าไม่ให้แสดง dialog แจ้งเตือน 
        if (total == 0) {
            setTextAlert("กรุณาระบุจำนวนสินค้า");
            document.getElementById('modalAddStock').showModal();
            return
        }
        //เก็บข้อมูล stock ลงในฐานข้อมูล
        const { data: stock, error } = await supabase
            .from('stock')
            .update({ product_total: parseInt(data[0].product_total) + parseInt(total) })
            .eq('product_id', data[0].product_id)
            .select('product_id')
        //เช็ค error ถ้าไม่มี error ให้ไปเก็บข้อมูล import ลงในฐานข้อมูลต่อ
        if (error) {
            alert("Error fetching: " + error);
        } else {
            //เช็คว่าเก็บข้อมูล stock ลงในฐานข้อมูลสำเร็จหรือไม่
            if (stock.length > 0) {
                //เก็บข้อมูล import สำเร็จหรือไม่
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
                //เช็ค error ถ้าไม่มี error ให้เซตค่าเริ่มต้น เเละ แสดง dialog แจ้งเตือน เพิ่มสินค้าสำเร็จ
                if (error) {
                    alert("Error fetching: " + error);
                } else {
                    //เช็คว่าเก็บข้อมูล import สำเร็จหรือไม่
                    if (importData.length > 0) {
                        //เซตค่าเริ่มต้น เเละ แสดง dialog แจ้งเตือน เพิ่มสินค้าสำเร็จ
                        setBarcode('');
                        setData([]);
                        setTotal(0);
                        setTextAlert("เพิ่มสินค้าเรียบร้อย");
                        document.getElementById('modalAddStock').showModal();
                    } else {
                        //เซตค่าเริ่มต้น เเละ แสดง dialog แจ้งเตือน เพิ่มสินค้าไม่สำเร็จ
                        setBarcode('');
                        setData([]);
                        setTotal(0);
                        setTextAlert("เพิ่มสินค้าไม่สำเร็จ");
                        document.getElementById('modalAddStock').showModal();
                    }
                }

            } else {
                //เซตค่าเริ่มต้น เเละ แสดง dialog แจ้งเตือน เพิ่มสินค้าไม่สำเร็จ
                setBarcode('');
                setData([]);
                setTotal(0);
                setTextAlert("เพิ่มสินค้าไม่สำเร็จ");
                document.getElementById('modalAddStock').showModal();
            }
        }
    };

    //ส่วนของหน้าเว็บ
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
                        {/* //ปุ่มกลับไปหน้า dashboard */}
                        <button className="btn btn-active btn-ghost" onClick={() => window.location.href = '/dashboard'}>กลับ</button>
                    </div>
                </div>

                {
                    //เช็คกดปุ่ม scan หรือไม่
                    btnScan == 'Y' ?
                        <>
                            {/* //เปิดกล้องสแกน */}
                            <BarcodeScannerComponent
                                onUpdate={(err, result) => {
                                    if (typeof result !== "undefined") {
                                        setBarcode(result?.text)
                                        searchBarcode(result?.text);
                                        setBtnScan('N')
                                    }
                                    else { console.log("cannot detect barcode or qr code") }
                                }}
                            />
                            {/* //ปุ่มปิด หน้า scan */}
                            <div className='pl-4 pr-4 pb-6'>
                                <button className="btn w-full mt-2 p-6 btn-active btn-ghost" onClick={() => setBtnScan('N')}>ปิด</button>
                            </div>
                        </>
                        :
                        <>
                            <div className='pl-4 pr-4 pb-6'>
                                <button className="btn w-full mt-2 p-6 btn-active btn-ghost" onClick={() => setBtnScan('Y')}>Scan</button>
                                {/* //input รหัสสินค้า ปุ่มค้นหา */}
                                <div className="join p-4 mt-6">
                                    <input type="number" id="search" className="input input-bordered join-item" placeholder="รหัสสินค้า" value={barcode} onChange={(e) => setBarcode(e.target.value)} />
                                    <button className="btn join-item rounded-r-full btn-active btn-ghost" onClick={() => search()}>ค้นหา</button>
                                </div>
                                <p className='pb-4'>สินค้า : {data.length == 0 ? <></> : data[0].product_name}</p>
                                <p className='pb-4'>สินค้าคงคลัง : {data.length == 0 ? <></> : data[0].product_total}</p>
                                {/* //จำนวนสินค้าที่ต้องการเพิ่ม */}
                                <div>
                                    <span><h1>เพิ่ม stock จำนวน :</h1></span><input type="number" placeholder="ระบุ" className="input input-bordered w-full max-w-xs" value={total} onChange={(e) => setTotal(e.target.value)} />
                                </div>
                                {/* //แสดงชื่อพนักงาน */}
                                <p className='pb-4 pt-4'>โดยพนักงาน : {userData?.name}</p>
                                {/* //ปุ่มเพิ่มสินค้า */}
                                <button className="btn w-full p-6  btn-active btn-ghost" onClick={() => addStock()}>เพิ่มสินค้า</button>
                            </div>
                        </>

                }

                {/* //dialog แจ้งเตือน เพิ่มสินค้าเรียบร้อย หรือ เพิ่มสินค้าไม่สำเร็จ */}
                <dialog id="modalAddStock" className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box">
                        <h1 className="py-4">{textAlert}</h1>
                        <div className="modal-action">
                            <form method="dialog">
                                {/* //ปุ่มปิด dialog */}
                                <button className="btn">ปิด</button>
                            </form>
                        </div>
                    </div>
                </dialog>
            </div>
        </>
    );
}

