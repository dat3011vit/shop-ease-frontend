import { FcEditImage, FcManager, FcInfo, FcAssistant } from 'react-icons/fc';
import {IconType} from "react-icons";
import {path} from "./path.ts";

type MenuItem = {
    id: number;
    text: string;
    icon:IconType; // Đổi Element thành JSX.Element
    path: string;
};


export const menuSidebar:MenuItem[] = [
    {
        id: 1,
        text: 'Hồ sơ',
        icon: FcEditImage,
        path: 'ho-so',
    },
    {
        id: 2,
        text: 'Địa chỉ',
        icon: FcManager,
        path: 'dia-chi',
    },

    {
        id: 3,
        text: 'Đổi mật khẩu',
        icon: FcInfo,
        path: 'doi-mat-khau',
    },
    // {
    //     id: 4,
    //     text: 'Hóa đơn',
    //     icon: FcAssistant,
    //     path: path.INVOCE_USER
    // },
    {
        id: 5,
        text: 'Đổi email',
        icon: FcInfo,
        path: 'doi-email',
    },
];

