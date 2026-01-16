import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SearchDonor from './components/home/SearchDonor';
import BecomeDonorForm from './components/home/BecomeDonorForm';
import EmergencyRequests from './components/home/EmergencyRequests';
import AboutPage from './pages/AboutPage';
import DonorDashboard from './pages/DonorDashboard';
import UpcomingEvents from './pages/UpcomingEvents';


function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<BecomeDonorForm />} />
            <Route path="search" element={<div className="pt-20"><SearchDonor /></div>} />
            <Route path="donate" element={<div className="pt-20"><BecomeDonorForm /></div>} />
            <Route path="emergency" element={<div className="pt-20"><EmergencyRequests /></div>} />
            <Route path="about" element={<AboutPage />} />
            <Route path="events" element={<div className="pt-20"><UpcomingEvents /></div>} />

            <Route path="donor-dashboard" element={<DonorDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
