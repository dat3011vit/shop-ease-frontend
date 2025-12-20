import { HeaderAdmin } from '@/components/shared/header/header-admin';
import { Footer, Header } from '../components/shared';
import { Outlet } from 'react-router-dom';
import UserList from '@/pages/admin/user-list';
import Chatbot from "@/pages/chatbot/chatbot.tsx";

const MainLayout = () => {
    return (
        <>
            <Header />
            {/* <HeaderAdmin /> */}
            <main className="main_layout">
                {/* <UserList/> */}
                <Outlet />
            </main>
            <Footer />
            <Chatbot/>
        </>
    );
};

export default MainLayout;
