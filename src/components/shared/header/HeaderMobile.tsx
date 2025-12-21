import { Link } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import {memo, useCallback, useState} from "react";
import { path } from "@/common/constants/path";
import {ERole} from "../../../common/models/User.ts";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {Dropdown, Menu} from "antd";
import {DownOutlined} from "@ant-design/icons";

interface HeaderMobileProps {
  onClose: () => void;
}
export const HeaderMobileComponent = ({ onClose }: HeaderMobileProps) => {
  const { user, role, account } = useSelector((state: RootState) => state?.user);
  const { categories,seasons } = useSelector((state: RootState) => state?.attribute);
  const handleCategoryClick = useCallback(() => {
    onClose();
  }, [onClose]);
  const [open1,setOpen1]=useState<boolean>(false)
  const [open2,setOpen2]=useState<boolean>(false)
  const [open3,setOpen3]=useState<boolean>(false)
  const [open4,setOpen4]=useState<boolean>(false)
  const [open5,setOpen5]=useState<boolean>(false)
  const [open6,setOpen6]=useState<boolean>(false)
  return (
    <div className="header-mobile">
      <div className="header-mobile__top">
        <div className="header__logo">
          <Link to={path.INDEX}>
            <img
              loading="lazy"
              src="https://ciseco-nextjs.vercel.app/_next/static/media/logo.14d0e71d.svg"
              alt="Logo"
            />
          </Link>
        </div>
        <div className="header-mobile__social">
          <p>
            Discover the most outstanding articles on all topics of life. Write
            your stories and share them
          </p>
          <div className="header-mobile__social--icon">
            <Link to={"https://www.facebook.com/FashionStore678"}><Icon icon={"logos:facebook"} /></Link>
            <Link to={"/"}><Icon icon={"logos:twitter"} /></Link>
            <Link to={"https://www.youtube.com/@tranat833"}><Icon icon="openmoji:youtube" /></Link>
            <Link to={"https://t.me/+84941217281"}><Icon icon="logos:telegram" /></Link>
          </div>
        </div>
      </div>
      {role !== ERole.ADMIN ?
          (
              <>
                <div className="header-mobile__categories">
                  <span  onClick={()=>setOpen2(prev=>!prev)}>
                      Danh mục <DownOutlined />
                  </span>
                  {open2 && (
                      <div className="header__dropdown-custom">
                        {categories?.map((item,index)=>(
                            <Link to={path.CATEGORY+item.id} className="header__dropdown-item" key={index}>
                              {item.name}
                            </Link>
                        ))}
                      </div>
                  )}

                  <span  onClick={()=>setOpen3(prev=>!prev)}>
                       Mùa <DownOutlined />
                  </span>
                  {open3 && (
                      <div className="header__dropdown-custom">
                        {seasons?.map((item,index)=>(
                            <Link to={path.SEASON+item.id} className="header__dropdown-item" key={index}>
                              {item.name}
                            </Link>
                        ))}
                      </div>
                  )}
                  <Link to={path.ORDERS} onClick={handleCategoryClick}>
                    Đơn hàng
                  </Link>
                  {/*<Link to={path.PRODUCT_COLLECTION} onClick={handleCategoryClick}>*/}
                  {/*  Collection*/}
                  {/*</Link>*/}
                  {/*<Link to={path.ABOUT} onClick={handleCategoryClick}>*/}
                  {/*  About*/}
                  {/*</Link>*/}
                  {/*<Link to={path.CONTACT} onClick={handleCategoryClick}>*/}
                  {/*  Contact*/}
                  {/*</Link>*/}
                  {/*<Link to={path.BLOG} onClick={handleCategoryClick}>*/}
                  {/*  Blog*/}
                  {/*</Link>*/}
                </div>
              </>
          ):(
              <>
                <div className="header-mobile__categories">
                  <span  onClick={()=>setOpen1(prev=>!prev)}>
                      Quản lý người dùng <DownOutlined />
                  </span>
                  {open1 && (
                      <div className="header__dropdown-custom">
                        <Link to="/user-list-ban" className="header__dropdown-item">
                          Người dùng bị cấm
                        </Link>
                        <Link to="/user-list" className="header__dropdown-item">
                          Người dùng hoạt động
                        </Link>
                      </div>
                  )}

                  <span  onClick={()=>setOpen4(prev=>!prev)}>
                      Quản lý sản phẩm <DownOutlined />
                  </span>
                  {open4 && (
                      <div className="header__dropdown-custom">
                        <Link to="/product-list" className="header__dropdown-item">
                          Danh sách sản phẩm
                        </Link>
                        <Link to="/add-product" className="header__dropdown-item">
                          Thêm sản phẩm
                        </Link>
                        <Link to="/product-attributes" className="header__dropdown-item">
                          Quản lý thuộc tính
                        </Link>
                      </div>
                  )}
                  <Link to={path.ORDER_MANAGEMENT}>Quản lý đơn hàng</Link>
                  <Link to={path.STATISTICS}>Thống kê</Link>

                </div>
              </>
          )
      }
    </div>
  );
};

export const HeaderMobile = memo(HeaderMobileComponent);
