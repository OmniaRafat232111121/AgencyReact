import logo from '../assets/images/Icon.svg';
import send from '../assets/images/send.png'
const Footer = () => {
  return (
    <div className="bg-[#263238] grid lg:grid-cols-4  md:grid-cols-2 sm:p-4 grid-cols-1 md:px-6 gap-6 px=4 lg:px-14 py-16  ">
      <div className="">
        <div className='flex gap-x-2 '>
        <img src={logo} alt="logo"/>
        
        <span className='text-[#FFFFFF] font-bold text-3xl'>Nexcent</span>
        </div>
        <div className='mt-5 text-[#F5F7FA] text-[0.875rem]'>
        <p>Copyright © 2020 Nexcent ltd.</p>
        <p>All rights reserved</p>
        </div>

      </div>
      <div>
        <h2 className="text-[#FFFFFF] mb-5 text-[1.25rem]">Company</h2>
        <ul className='text-[#F5F7FA]'>

          <li className='mb-2'>About us</li>
          <li className='mb-2'>Contact us</li>
          <li className='mb-2'>pricing</li>
          <li className='mb-2'>Testimonials</li>

        </ul>

      </div>
      
      <div>
        <h2 className="text-[#FFFFFF] mb-5 text-[1.25rem]">Support</h2>
        <ul className='text-[#F5F7FA]'>

          <li className='mb-2'>Help center</li>
          <li className='mb-2'>Terms of service</li>
          <li className='mb-2'>Legal</li>
          <li className='mb-2'>Privacy policy</li>
          <li className='mb-2'>Status</li>

        </ul>

      </div>


      <div>
        <h2 className="text-[#FFFFFF] mb-5">Stay up to date</h2>
<div className='relative'>
<input type="text" placeholder="enter your email" className='rounded focus:outline-none '/>
<img src={send} alt="send" className='absolute top-3 left-[200px]' />
  </div>        
        

      </div>
      
    </div>
  )
}

export default Footer
