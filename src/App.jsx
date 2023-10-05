
import './App.css'
import About from './components/About'
import Blog from './components/Blog'
import Footer from './components/Footer'
import Home from './components/Home'
import Navbar from './components/Navbar'
import News from './components/News'
import Services from './components/Services'

function App() {

  return (
    <>
      <Navbar/>
      <Home/>
      <Services/>
      <About/>
      <Blog/>
      <News/>
      <Footer/>
    </>
  )
}

export default App
