import pana from '../assets/images/pana.png'
import coll from '../assets/images/coll.png'
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <div>

<div className=' px-4 lg:px-14 max-w-screen-2xl mx-auto'>
        <div className='md:w-11/12 mx-auto flex flex-col md:flex-row justify-between items-center gap-12'>
        <div>
          <img src={coll} alt="about1"/>
        </div>
        <div className='md:w-3/5 mx-auto'>
        <h2 className='text-[2.25rem] text-[#4D4D4D] font-semibold'>
  {t('about.heading')}
</h2>
<p className='text-[0.875rem] text-[naturalGray] md:w-3/4 mb-8'>
  {t('about.description')}
</p>
<button className='btn-primary'>{t('about.buttonText')}</button>

        </div>
        </div>
      </div>

     

      {/*company status*/}
      <div className='px-4 lg:px-14 max-w-screen-full mx-auto bg-[#F5F7FA] py-16'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-8'>
          <div className='md:w-1/2'>
            <h2 className='text-4xl text-naturalGray font-semibold mb-4 md:w-2/3'>Helping a local 
              <br/>
              <span className='text-green'>
              business reinvent itself
                </span>
                </h2>
              <p>We reached here with our hard work and dedication</p>

          </div>
          <div className='md:w-1/2 mx-auto flex sm:flex-row flex-col sm:items-center justify-around gap-12'>
            <div className='space-y-8'>
              <div className='flex items-center gap-4'>
                <img src='/src/assets/images/Icon1.png'/>
                <div>
                <h4 className='text-2xl text-naturalGray font-semibold'>2,245,341</h4>
                  <p>Members</p>
                </div>
              </div>


              <div className='flex items-center gap-4'>
                <img src='/src/assets/images/icon2.png'/>
                <div>
                <h4 className='text-2xl text-naturalGray font-semibold'>828,867</h4>
                  <p>Event Bookings</p>
                </div>
              </div>
            </div>
            <div className='space-y-8'>
            <div className='flex items-center gap-4'>
                <img src='/src/assets/images/icn3.png'/>
                <div>
                <h4 className='text-2xl text-naturalGray font-semibold'>46,328</h4>
                  <p>Clubs</p>
                </div>
              </div>
              <div className='flex items-center gap-4'>
                <img src='/src/assets/images/Icon4.png'/>
                <div>
                  <h4 className='text-2xl text-naturalGray font-semibold'>1,926,436</h4>
                  <p>Payement</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>



      <div className=' px-4 lg:px-14 max-w-screen-2xl mx-auto'>
        <div className='md:w-11/12 mx-auto flex flex-col md:flex-row justify-between items-center gap-12'>
        <div>
          <img src={pana} alt="about1"/>
        </div>
        <div className='md:w-3/5 mx-auto'>
          <h2 className='text-[2.25rem] text-[#4D4D4D] font-semibold'>How to design your site footer like we did</h2>
          <p className='text-[0.875rem] text-[naturalGray] md:w-3/4 mb-8'>Donec a eros justo. Fusce egestas tristique ultrices. Nam tempor, augue nec tincidunt molestie, massa nunc varius arcu, at scelerisque elit erat a magna. Donec quis erat at libero ultrices mollis. In hac habitasse platea dictumst. Vivamus vehicula leo dui, at porta nisi facilisis finibus. In euismod augue vitae nisi ultricies, non aliquet urna tincidunt. Integer in nisi eget nulla commodo faucibus efficitur quis massa. Praesent felis est, finibus et nisi ac, hendrerit venenatis libero. Donec consectetur faucibus ipsum id gravida.</p>
           <button className='btn-primary'>Learn more</button>
        </div>
        </div>
      </div>
      <div className=' px-4 lg:px-14 max-w-screen-full  mx-auto py-16 bg-[#F5F7FA]'>

       <div className='flex flex-col md:flex-row justify-between items-center '>
       <div className='md:w-1/3 mx-auto'>
        <img src="/src/assets/images/head.png"/>
       </div>
      <div className='md:w-2/3 mx-auto'>
        <div>
          <p className='leading-7 md:w-4/5 text-naturalGray mb-8 text-sm'>Maecenas dignissim justo eget nulla rutrum molestie. Maecenas lobortis sem dui, vel rutrum risus tincidunt ullamcorper. Proin eu enim metus. Vivamus sed libero ornare, tristique quam in, gravida enim. Nullam ut molestie arcu, at hendrerit elit. Morbi laoreet elit at ligula molestie, nec molestie mi blandit. Suspendisse cursus tellus sed augue ultrices, quis tristique nulla sodales. Suspendisse eget lorem eu turpis vestibulum pretium. Suspendisse potenti. Quisque malesuada enim sapien, vitae placerat ante feugiat eget. Quisque vulputate odio neque, eget efficitur libero condimentum id. Curabitur id nibh id sem dignissim finibus ac sit amet magna.</p>
          <h5 className='text-xl text-green font-semibold'>Tim Smith</h5>
          <p className='text-[1rem] text-naturalGray'>British Dragon Boat Racing Association</p>
          <div>
            <div className='flex items-center gap-8 flex-wrap mt-4'>
              <img src='/src/assets/images/ll.png'/>
              <img src='/src/assets/images/ll.png'/>
              <img src='/src/assets/images/ll.png'/>
              <img src='/src/assets/images/ll.png'/>
              <img src='/src/assets/images/ll.png'/>
              <img src='/src/assets/images/ll.png'/>
<div>
  <a href="" className='font-bold text-green hover:text-neutral-700'>Meet all customers
  {" "}
  <svg xmlns="http://www.w3.org/2000/svg"
   width="17"
    height="11"
     viewBox="0 0 17 11"
      fill="none"
      className='ml-2 inline-block'>
<path d="M12 9.39905L15.2929 6.10615C15.6834 5.71563 15.6834 5.08246 15.2929 4.69194L12 1.39905M15 5.39905L1 5.39905" 
stroke="#4CAF4F"
 />
</svg>
</a>

</div>
            </div>
          </div>
        </div>

      </div>
       </div>
       </div>
      
    </div>
  )
}

export default About
