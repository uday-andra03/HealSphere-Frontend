import Hero from '../features/landing/components/NewHero'
import Features from '../features/landing/components/Features'
import TopHospitals from '../features/landing/components/TopHospitals'
import DoctorCTA from '../features/landing/components/DoctorCTA'

function Home() {
    return (
        <div className="home-page">
            <Hero />
            <Features />
            <TopHospitals />
            <DoctorCTA />
        </div>
    )
}

export default Home
