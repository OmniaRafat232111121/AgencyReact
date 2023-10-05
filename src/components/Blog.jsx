
const Blog = () => {
  const blogs=[
    {
      id:1,
      title:'Creating Streamlined Safeguarding Processes with OneRen',
      image:'/src/assets/images/blog1.png'
    },
    {
      id:2,
      title:'What are your safeguarding responsibilities and how can you manage them?',
      image:'/src/assets/images/blog2.png',
    },
    {
      id:3,
      title:'Revamping the Membership Model with Triathlon Australia',
      image:'/src/assets/images/blog3.png'
    }
  ]
  return (
    <div className="px-4 lg:px-14 max-w-screen-2xl mx-auto my-12">
      <div className="text-center md:w-1/2 mx-auto">
        <h2 className="mb-4 font-semibold text-4xl text-naturalGray">Caring is the new marketing</h2>
       <p className="text-naturalGray text-sm md:w-3/4 mx-auto mb-4">The Nexcent blog is the best place to read about the latest membership insights, trends and more. See whos joining the community, read about how our community are increasing their membership income and lots more</p>
      </div>

      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 items-center justify-between">
        {blogs.map(blog=><div key={blog.id} className="mb-12 mx-auto cursor-pointer relative">
          <img src={blog.image} alt="blog" className="hover:scale-90 transition-all
           duration-400"/>
          <div className=" px-4 py-8 absolute shadow-md rounded-md md:w-3/4 mx-auto
           bg-white right-0 -bottom-12 left-0">
            <h3 className="mb-3 text-naturalGray font-semibold">{blog.title}</h3>
            <div className="flex items-center gap-8">
              <a href="/"
              className="font-bold text-green hover:text-natural-700">Read More
              <svg xmlns="http://www.w3.org/2000/svg" width="17" height="11"
               viewBox="0 0 17 11" fill="none"
               className="ml-2 inline-block text-green">
  <path d="M12.5 9.39905L15.7929 6.10615C16.1834 5.71563 16.1834 5.08246 15.7929 4.69194L12.5 1.39905M15.5 5.39905L1.5 5.39905" stroke="#4CAF4F" />
</svg>
</a>
              </div>
            </div>
          </div>)}

      </div>
      
    </div>

  )
}

export default Blog
