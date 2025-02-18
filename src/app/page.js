'use client'
 
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  return (
    <div className="bg-base-200 min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold">Stock Management</h1>
          <button className="btn  sm:btn-sm md:btn-md lg:btn-lg w-2/3 mt-4 p-6 btn-active btn-ghost" onClick={() => router.push('/deletestock')}>เบิกสินค้า</button>
          <button className="btn  sm:btn-sm md:btn-md lg:btn-lg w-2/3 mt-4 p-6 btn-active btn-ghost" onClick={() => router.push('/addstock')}>เพิ่มสินค้า</button>
          <button className="btn  sm:btn-sm md:btn-md lg:btn-lg w-2/3 mt-4 p-6 btn-active btn-ghost" onClick={() => router.push('/checkstock')}>เช็ค Stock</button>
    </div>
  );
}
