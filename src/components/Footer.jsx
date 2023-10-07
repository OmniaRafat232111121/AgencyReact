import logo from '../assets/images/Icon.svg';
import send from '../assets/images/send.png';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-[#263238] grid lg:grid-cols-4  md:grid-cols-2 sm:p-4 grid-cols-1 md:px-6 gap-6 px=4 lg:px-14 py-16  ">
      <div className="">
        <div className='flex gap-x-2 '>
        <img src={logo} alt="logo"/>
        
        <span className='text-[#FFFFFF] font-bold text-3xl'>Nexcent</span>
        </div>
        <div className='mt-5 text-[#F5F7FA] text-[0.875rem]'>
          <p>{t('footer.copyright')}</p>
          <p>{t('footer.allRightsReserved')}</p>
        </div>

      </div>
      <div>
      <h2 className="text-[#FFFFFF] mb-5 text-[1.25rem]">{t('footer.company')}</h2>
<ul className="text-[#F5F7FA]">
  <li className="mb-2">{t('footer.aboutUs')}</li>
  <li className="mb-2">{t('footer.contactUs')}</li>
  <li className="mb-2">{t('footer.pricing')}</li>
  <li className="mb-2">{t('footer.testimonials')}</li>
</ul>

      </div>
      
      <div>
      <h2 className="text-[#FFFFFF] mb-5 text-[1.25rem]">{t('footer.support')}</h2>
        <ul className="text-[#F5F7FA]">
          <li className="mb-2">{t('footer.helpCenter')}</li>
          <li className="mb-2">{t('footer.termsOfService')}</li>
          <li className="mb-2">{t('footer.legal')}</li>
          <li className="mb-2">{t('footer.privacyPolicy')}</li>
          <li className="mb-2">{t('footer.status')}</li>
        </ul>

      </div>


      <div>
<h2 className="text-[#FFFFFF] mb-5 text-[1.25rem]">{t('footer.stayUpToDate')}</h2>
        <div className='relative'>
          <input
            type="text"
            placeholder={t('footer.emailPlaceholder')}
            className='rounded focus:outline-none'
          /><img src={send} alt="send" className='absolute top-3 left-[200px]' />
  </div>        
        

      </div>
      
    </div>
  )
}

export default Footer
