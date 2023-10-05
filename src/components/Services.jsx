
const Services = () => {
  const services=[
    {
      id:1,
      title:'Membership Organisations',
      desc:'Our membership management software provides full automation of membership renewals and payments',
      image:'/src/assets/images/s1.png'
    },
    {
      id:2,
      title:'National Associations',
      desc:'Our membership management software provides full automation of membership renewals and payments',
      image:'/src/assets/images/s2.png',

    },{
      id:3,
      title:'Clubs And Groups',
      desc:'Our membership management software provides full automation of membership renewals and payments',
      image:'/src/assets/images/s3.png'
    }
  ]
  return (
    <div className="max-w-screen-2xl mx-auto md:px-14 px-4 py-16">
      <div className="text-center mx-auto  my-8">
        <h2 className="text-[#4D4D4D] font-semibold text-[2.25rem]">Our Clients</h2>
        <p className="text-[#717171]">We have been working with some Fortune 500+ clients</p>
      </div>
      <div className=" my-12 flex flex-wrap items-center justify-between gap-8">
        <img src="/src/assets/images/c1.png" alt="c1"/>
        <img src="/src/assets/images/c2.png" alt="c2"/>
        <img src="/src/assets/images/c3.png" alt="c3"/>
        <img src="/src/assets/images/c4.png" alt="c4"/>
        <img src="/src/assets/images/c5.png" alt="c5"/>
        <img src="/src/assets/images/c6.png" alt="c6"/>
        <img src="/src/assets/images/c7.png" alt="c7"/>




      </div>
      {/*services card*/}
      <div className="text-center mx-auto  mt-20 md:w-1/2">
        <h2 className="text-[#4D4D4D] text-[2.25rem] font-semibold mb-3 text-4xl">Manage your entire community in a single system</h2>
        <p className="text-[#717171]">Who is Nextcent suitable for?</p>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
        {services.map((service)=>(
          <div key={service.id} className=" md:w-[300px]  md:h-80  shadow cursor-pointer  hover:border-b-8 hover:border-b-indigo-600 text-center  mx-auto transition-all duration-300 flex items-center justify-center">
            <div>
            <div className="bg-[#E8F5E9] h-14 w-14 mx-auto rounded-tl-3xl rounded-br-3xl">
              <img className="-ml-4" src={service.image}/>
              </div>
              <h4 className="text-2xl text-[#4D4D4D] mb-2 px-3">{service.title}</h4>
              <p className="text-sm text-naturalGray">{service.desc}</p>
            </div>
              </div>
        ))}
      </div>
      
    </div>
  )
}

export default Services
