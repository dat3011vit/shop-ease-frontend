import { useEffect } from "react";
// import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../store";
import {ERole} from "../common/models/User.ts";
import {toast} from "react-toastify";

interface ProtectedRouteProps {
  isCheck: ERole[]; // Các vai trò cần kiểm tra
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isCheck }) => {
  const {account} = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!account) {
      toast.error("Trang này cần đăng nhập tài khoản vui lòng đăng nhập!");
    } else if (!isCheck.includes(account?.role?.name)) {
      console.log("aaaaaaaaa2")

      toast.error(`Không có quyền truy cập trang này vui lòng đăng nhập tài khoản ${isCheck?.join(', ')}`);
    }
  }, [account, isCheck]);

  if (!account) {
    return <Navigate to="/" replace />;
  }

  if (!isCheck.includes(account?.role?.name)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return  <Outlet />;
};

export default ProtectedRoute;
