import "./index.scss";
import { Outlet, useNavigate } from "react-router-dom";
import { Container } from "../../components/shared";
import { DataTabItem, Tabs } from "../../components/ui/Tabs";
import {path} from "../../common/constants/path.ts";
import Sidebar from "./sidebar/sidebar.tsx";
export const TabAccountData = [
    {
        id: 1,
        title: "Account info",
        path: path.ACCOUNT,
    },
    {
        id: 2,
        title: "Save lists",
        path: path.WISHLIST,
    },
    {
        id: 3,
        title: "My order",
        path: path.ACCOUNT_ORDER,
    },
];

const Account = () => {
    const navigate = useNavigate();

    const handleChangeTab = (tab: DataTabItem) => {
        navigate(tab?.path || "");
    };

    return (
        <div className="account-page-modern">
            <Container>
                <div className="account-page-modern__wrapper">
                    <div className="account-page-modern__sidebar">
                        <Sidebar/>
                    </div>
                    <div className="account-page-modern__content">
                        <Outlet/>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Account;
