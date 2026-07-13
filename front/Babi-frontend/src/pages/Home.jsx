import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Categories from '../components/Categories'
import HowItWorks from '../components/HowItWorks'
import BestPros from '../components/BestPros'
import TrustSection from '../components/TrustSection'
import ProCTA from '../components/ProCTA'
import Testimonials from '../components/Testimonials'
import FinalCTA from '../components/FinalCTA'
import Footer from '../components/Footer'

function Home() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <Categories />
      <HowItWorks />
      <BestPros />
      <TrustSection />
      <ProCTA />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  )
}

export default Home
