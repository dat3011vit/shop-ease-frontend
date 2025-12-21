import { FcEditImage, FcManager, FcInfo, FcAssistant } from 'react-icons/fc';
import {IconType} from "react-icons";
import {path} from "./path.ts";
import i18n from '@/i18n';

type MenuItem = {
    id: number;
    textKey: string;
    icon:IconType; // Đổi Element thành JSX.Element
    path: string;
};


export const menuSidebar:MenuItem[] = [
    {
        id: 1,
        textKey: 'account:profile',
        icon: FcEditImage,
        path: 'ho-so',
    },
    {
        id: 2,
        textKey: 'account:address',
        icon: FcManager,
        path: 'dia-chi',
    },

    {
        id: 3,
        textKey: 'account:changePassword',
        icon: FcInfo,
        path: 'doi-mat-khau',
    },
    // {
    //     id: 4,
    //     textKey: 'Hóa đơn',
    //     icon: FcAssistant,
    //     path: path.INVOCE_USER
    // },
    {
        id: 5,
        textKey: 'account:changeEmail',
        icon: FcInfo,
        path: 'doi-email',
    },
];

