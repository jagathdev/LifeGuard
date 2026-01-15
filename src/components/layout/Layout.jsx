import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-mint-white dark:bg-deep-midnight text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Navbar />
            <main className="grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
