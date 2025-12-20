import {useEffect} from "react";

import {RootState} from "../../store";
import {useSelector} from "react-redux";
import {Outlet, useNavigate} from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();

  const { isLoggedIn } = useSelector((state:RootState) => state.auth);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isLoggedIn && navigate('/');
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff7ed] py-8">
      <div className="w-full max-w-6xl px-4 py-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr,1fr] items-stretch">
          <div className="hidden lg:flex flex-col justify-center rounded-2xl bg-gradient-to-br from-[#fed7aa] via-[#fb923c] to-[#f97316] p-12 text-white shadow-2xl">
            <p className="text-sm uppercase tracking-[0.25em] font-semibold opacity-90">Welcome back</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight">
              Trải nghiệm mua sắm <br /> nhanh chóng & tiện lợi
            </h1>
            <p className="mt-4 text-base opacity-90">
              Theo dõi đơn hàng, lưu địa chỉ giao nhận và nhận ưu đãi dành riêng cho bạn.
            </p>
            <div className="mt-8 space-y-4 text-base">
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-white" /> Mã giảm giá mới mỗi tuần
              </div>
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-white" /> Thanh toán an toàn, hỗ trợ 24/7
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-white/60 blur-xl" />
            <div className="relative rounded-2xl bg-white shadow-xl border border-[#fed7aa] p-8 sm:p-10 lg:p-12">
              <Outlet/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
