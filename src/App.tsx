import { ThemeProvider } from '@/components/theme-provider';
import dayjs from 'dayjs';
import vi from 'dayjs/locale/vi';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './app.css';
import { ProtectAuth, ProtectHome } from './components/ProtectRoute';
import { NotFound } from './components/common';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from './components/ui/alert-dialog';
import StorageKeys from './constants/storage-keys';
import { NewPass } from './features/NewPass';
import { authActions } from './features/auth/AuthSlice';
import { LoginPage } from './features/auth/pages/LoginPage';
import Home from './features/home';
import { ManagerNotification, ManagerPass, Personalisation, Profile } from './features/settings';
import { SettingsLayout } from './features/settings/SettingsLayout';
import Welcome from './features/welcome';
import { PermissionProvider } from './utils';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { NewsFeed } from './features/home/NewsFeed';
import { Friends } from './features/home/Friends';
import { Learns } from './features/home/Learns';
import { Chats } from './features/home/Chats';
import { appActions } from './app/AppSlice';
const checkTokenExpiration = (token: string) => {
    const decodedToken = jwtDecode<JwtPayload>(token);
    const currentTime = Date.now() / 1000; // Chuyển đổi thời gian hiện tại sang định dạng Unix time

    // Kiểm tra xem thời gian hết hạn của token có lớn hơn thời gian hiện tại hay không
    if (decodedToken && decodedToken?.exp) {
        if (decodedToken.exp < currentTime) {
            // Token đã hết hạn, chuyển hướng người dùng đến trang đăng nhập
            return false;
        } else return true;
    }
};
function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height,
    };
}
function App() {
    dayjs.locale(vi);
    const P = PermissionProvider();
    const token = localStorage.getItem(StorageKeys.TOKEN);
    const location = useLocation();
    const [allertLogin, setAlertLogin] = useState(false);
    useEffect(() => {
        if (token) {
            if (!checkTokenExpiration(token)) {
                setAlertLogin(true);
            }
        }
    }, [location.pathname, token]);

    const dispatch = useDispatch();
    useEffect(() => {
        function handleResize() {
        
            dispatch(appActions.setWidth(getWindowDimensions().width));
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <ThemeProvider defaultTheme="light" storageKey="theme">
            <div className="w-screen h-screen relative">
                <AlertDialog open={allertLogin} onOpenChange={setAlertLogin}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Hết hạn phiên đăng nhập</AlertDialogTitle>
                            <AlertDialogDescription>
                                Yêu cầu đăng nhập lại do hết hạn phiên đăng nhập.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogAction
                                onClick={() => {
                                    dispath(authActions.logout());
                                }}
                            >
                                Đăng nhập
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route element={<ProtectAuth />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </Route>
                    <Route element={<ProtectHome />}>
                        <Route path="/home" element={<Home />}>
                            <Route index element={<Navigate to="news-feed" />} />
                            <Route path="news-feed" element={<NewsFeed />} />
                            <Route path="friends" element={<Friends />} />
                            <Route path="learns" element={<Learns />} />
                            <Route path="chats" element={<Chats />} />
                        </Route>
                        <Route path="settings" element={<SettingsLayout />}>
                            <Route index element={<Navigate to="profile" />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="notification" element={<ManagerNotification />} />
                            <Route path="password" element={<ManagerPass />} />
                            <Route path="personalisation" element={<Personalisation />} />
                        </Route>
                    </Route>
                    <Route path="/forgot/reset-password/:token" element={<NewPass />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </ThemeProvider>
    );
}

export default App;
