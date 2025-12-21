import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {  NavLink } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi';

import './slidebar.scss';
import {menuSidebar} from "../../../common/constants/menu-item.ts";
import { useTranslation } from 'react-i18next';

export default function Sidebar() {
    const { t } = useTranslation();
    const { currentData } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    return (
        <div className="sidebar-modern">
            <div className="sidebar-modern__header">
                <h2 className="sidebar-modern__title">{t('account:myAccount')}</h2>
            </div>
            <div className="sidebar-modern__content">
                {menuSidebar.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item?.path}
                        className={({ isActive }) =>
                            `sidebar-modern__item ${isActive ? 'active' : ''}`
                        }
                    >
                        <span className="sidebar-modern__icon">
                            {<item.icon/>}
                        </span>
                        <span className="sidebar-modern__text">{t(item.textKey)}</span>
                    </NavLink>
                ))}
            </div>
        </div>
    );
}
