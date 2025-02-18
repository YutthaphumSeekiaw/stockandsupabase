'use client'

import React, { useEffect, useState } from 'react';
import supabase from '../supabase-client';

export default function CheckStock() {
  //ประกาศตัวแปร
  const [data, setData] = useState([]);
  const [text, setText] = useState([]);

  //โหลดข้อมูลเมื่อเปิดหน้าเว็บครั้งแรก
  useEffect(() => {
    //เช็คว่ามีข้อมูลใน localStorage หรือไม่ ถ้าไม่มีให้เปลี่ยนหน้าไปที่หน้า login
    if (!localStorage.getItem('userData')) {
      router.push('/')
    }
  }, []);

  //โหลดข้อมูลเมื่อเปิดหน้าเว็บครั้งแรก
  useEffect(() => {
    firstSearch();
  }, []);

  //function ดึงข้อมูลสินค้าจากฐานข้อมูล เมื่อเปิดหน้าเว็บครั้งแรก
  const firstSearch = async () => {
    //ดึงข้อมูลสินค้าจากฐานข้อมูล
    let { data: stock, error } = await supabase
      .from('stock')
      .select("product_id,product_name,product_total")

    if (error) {
      alert("Error fetching: " + error);
    } else {
      //เก็บข้อมูลลงตัวแปร data
      setData(stock);
    }
  };

  //function ค้นหาสินค้าจากฐานข้อมูล
  const search = async () => {
    //ดึงข้อมูลสินค้าจากฐานข้อมูล
    let { data: stock, error } = await supabase
      .from('stock')
      .select("product_id,product_name,product_total")
      .like('product_id', '%' + document.getElementById('search').value + '%')

    if (error) {
      alert("Error fetching: " + error);
    } else {
      //เก็บข้อมูลลงตัวแปร data
      setData(stock);
    }
  };

  //ส่วนของหน้าเว็บ
  return (
    <div className="bg-base-200 min-h-screen">

      <div className="navbar bg-base-100">
        <div className="navbar-start">
        </div>
        <div className="navbar-center">
          <a className="btn btn-ghost text-xl">เช็ค Stock</a>
        </div>
        <div className="navbar-end">
          {/* //ปุ่มกลับไปหน้า dashboard */}
          <button className="btn btn-active btn-ghost" onClick={() => window.location.href = '/dashboard'}>กลับ</button>
        </div>
      </div>

      <div className="join p-4 mt-4">
        {/* //input ค้นหา รหัสสินค้า*/}
        <input type="number" id="search" className="input input-bordered join-item" placeholder="รหัสสินค้า" />
        {/* //ปุ่มค้นหา */}
        <button className="btn join-item rounded-r-full btn-active btn-ghost" onClick={() => search()} >ค้นหา</button>
      </div>
      {/* //แสดงข้อมูลสินค้า */}
      <div className="overflow-x-auto ">
        <table className="table table-xs table-pin-rows table-pin-cols">
          <thead>
            <tr>
              <th></th>
              <td>รหัสสินค้า</td>
              <td>สินค้า</td>
              <td>จำนวนคงเหลือ</td>
              <td>สถานะ</td>
            </tr>
          </thead>
          <tbody>
            {
              //เอาข้อมูลในตัวแปร data stock มาแสดง
              Object.keys(data).map((key, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{data[key].product_id}</td>
                  <td>{data[key].product_name}</td>
                  <td>{data[key].product_total}</td>
                  {
                    data[key].product_total == 0 ? <td>สินค้าหมด</td> : data[key].product_total > 10 ? <td></td> : <td>สินค้าใกล้หมด</td>
                  }
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}