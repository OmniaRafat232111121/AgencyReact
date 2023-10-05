'use client';

import { Carousel } from 'flowbite-react';
import banner from '../assets/images/banner1.png'
const Home = () => {
  return (
    <div className="bg-[#F5F7FA]">
      <div className="  h-screen min-h-screen max-w-screen-2xl mx-auto">
    <Carousel className='w-full mx-auto'>
      <div className="flex h-full items-center justify-center ">
       <div className=' my-28 md:my-8 py-12 flex flex-col md:flex-row-reverse 
       items-center justify-between gap-12 '>
        <div>
          <img src={banner} alt="banner1"/>
        </div>
        <div className='md:w-1/2'>
          <h1 className='text-5xl font-semibold mb-4 text-naturalGray leading-snug
           md:w-[600px]
          '>
         
            Lessons and insights 
            {" "}
            {" "}
          <span className='text-green leading-snug'>from 8 years </span> 
          </h1>
          <p className='text-naturalGray text-base text-[1rem] mb-8'>Where to grow your business as a photographer: site or social media?</p>
          <button className='btn-primary'>Register </button>

        </div>
       </div>
      </div>


      <div className="flex h-full items-center justify-center ">
       <div className=' my-28 md:my-8 py-12 flex flex-col md:flex-row-reverse 
       items-center justify-between gap-12 '>
        <div>
          <img src={banner} alt="banner1"/>
        </div>
        <div className='md:w-1/2'>
          <h1 className='text-5xl font-semibold mb-4 text-naturalGray leading-snug
           md:w-[600px]
          '>
         
            Lessons and insights 
            {" "}
            {" "}
          <span className='text-green leading-snug'>from 8 years </span> 
          </h1>
          <p className='text-naturalGray text-base text-[1rem] mb-8'>Where to grow your business as a photographer: site or social media?</p>
          <button className='btn-primary'>Register </button>

        </div>
       </div>
      </div>


      <div className="flex h-full items-center justify-center ">
       <div className=' my-28 md:my-8 py-12 flex flex-col md:flex-row-reverse 
       items-center justify-between gap-12 '>
        <div>
          <img src={banner} alt="banner1"/>
        </div>
        <div className='md:w-1/2'>
          <h1 className='text-5xl font-semibold mb-4 text-naturalGray leading-snug
           md:w-[600px]
          '>
         
            Lessons and insights 
            {" "}
            {" "}
          <span className='text-green leading-snug'>from 8 years </span> 
          </h1>
          <p className='text-naturalGray text-base text-[1rem] mb-8'>Where to grow your business as a photographer: site or social media?</p>
          <button className='btn-primary'>Register </button>

        </div>
       </div>
      </div>
      
    </Carousel>
    
      </div>
      
    </div>
  )
}

export default Home
