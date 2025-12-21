import {useEffect} from "react";

import {RootState} from "../../store";
import {useSelector} from "react-redux";
import {Outlet, useNavigate} from "react-router-dom";
import backgroundVideo from '@/assets/videos/background-shopping.mp4';
import { LanguageSwitcher } from '@/components/shared';
import { useTranslation } from 'react-i18next';

const AuthPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('auth');

  const { isLoggedIn } = useSelector((state:RootState) => state.auth);
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isLoggedIn && navigate('/');
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-8">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>

      {/* Overlay để làm tối video */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40"></div>

      {/* Language Switcher */}
      <div className="absolute top-8 right-8 z-20">
        <LanguageSwitcher variant="auth" />
      </div>

      {/* Content */}
      <div className="w-full max-w-6xl px-4 py-10 relative z-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr,1fr] items-stretch">
          <div className="hidden lg:flex flex-col justify-center rounded-2xl bg-gradient-to-br from-[#fed7aa] via-[#fb923c] to-[#f97316] p-12 text-white shadow-2xl">
            <p className="text-sm uppercase tracking-[0.25em] font-semibold opacity-90">{t('welcomeMessage.tagline')}</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight">
              {t('welcomeMessage.title')}
            </h1>
            <p className="mt-4 text-base opacity-90">
              {t('welcomeMessage.subtitle')}
            </p>
            <div className="mt-8 space-y-4 text-2xl-bold">
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-white" /> {t('welcomeMessage.feature1')}
              </div>
              <div className="flex items-center gap-3">
                <span className="h-2.5 w-2.5 rounded-full bg-white" /> {t('welcomeMessage.feature2')}
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
