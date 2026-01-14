import Hero from '../components/home/Hero';
import SearchDonor from '../components/home/SearchDonor';
import Stats from '../components/home/Stats';
import About from '../components/home/About';
import WhyDonate from '../components/home/WhyDonate';
import HowItWorks from '../components/home/HowItWorks';
import EmergencyRequests from '../components/home/EmergencyRequests';
import Testimonials from '../components/home/Testimonials';
import BecomeDonorForm from '../components/home/BecomeDonorForm';

const HomePage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Hero />
            <SearchDonor />
            <Stats />
            <About />
            <WhyDonate />
            <EmergencyRequests />
            <HowItWorks />
            <Testimonials />
            <BecomeDonorForm />
        </div>
    );
};

export default HomePage;
