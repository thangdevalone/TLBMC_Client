import { STATIC_HOST_NO_SPLASH } from '@/constants';
import { useInfoUser } from '@/hooks';
import { LogOut, Settings, SquareUserRound } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Icons } from './icons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useAppDispatch } from '@/app/hooks';
import { useState } from 'react';
import { authActions } from '@/features/auth/AuthSlice';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { cn } from '@/lib/utils';
import { useTheme } from './theme-provider';

export const NavHeader = () => {
    const user=useInfoUser()
    const [openAlertLogout, setOpenAlertLogout] = useState(false);
    const dispatch = useAppDispatch();
    const handleLogout = () => {
        dispatch(authActions.logout());
    };
    const {theme}=useTheme()
    const {pathname}=useLocation()
    return (
        <div
            className="w-full flex px-5 py-1 bg-background relative z-[10]"
            style={{ boxShadow: '0 4px 2px -2px rgba(0, 0, 0, 0.2)' }}
        >
            <div className="container">
                <div className="flex items-center justify-between">
                    <img src="/assets/logo.png"  className="object-contain h-[65px] p-1" />
                    <div className='flex flex-row gap-5'>
                        <Link to={"/home/news-feed"}>
                        <div className={cn("cursor-pointer p-2 gap-[2px] items-center flex flex-col  hover:bg-slate-200 dark:hover:bg-[#334257]  rounded-md",pathname=="/home/news-feed"?"bg-slate-200 dark:bg-[#334257] ":"")}>
                            <Icons.home color={theme==="dark" ? "white":""}/>
                            <span className="font-medium text-sm">Trang chủ</span>
                        </div>
                        </Link>
                        <Link to={"/home/friends"}>
                        <div className={cn("cursor-pointer p-2 gap-[2px] items-center flex flex-col hover:bg-slate-200 dark:hover:bg-[#334257]  rounded-md",pathname=="/home/friends"?"bg-slate-200 dark:bg-[#334257]":"")}>
                            <Icons.network color={theme==="dark" ? "white":""}/>
                            <span className="font-medium text-sm">Kết bạn</span>
                        </div>
                        </Link>
                        <Link to={"/home/learns"}>
                        <div className={cn("cursor-pointer p-2 gap-[2px] items-center flex flex-col hover:bg-slate-200 dark:hover:bg-[#334257] rounded-md",pathname.split('/').includes('learns')?"bg-slate-200 dark:bg-[#334257]":"")}>
                            <Icons.data color={theme==="dark" ? "white":""}/>
                            <span className="font-medium text-sm">Kho khóa học</span>
                        </div>
                        </Link>
                        <Link to={"/home/chats"}>
                        <div className={cn("cursor-pointer p-2 gap-[2px] items-center flex flex-col hover:bg-slate-200 dark:hover:bg-[#334257]  rounded-md",pathname=="/home/chats"?"bg-slate-200 dark:bg-[#334257]":"")}>
                            <Icons.chat color={theme==="dark" ? "white":""} />
                            <span className="font-medium text-sm">Tin nhắn</span>
                        </div>
                        </Link>
                    </div>
                    <>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <img
                                            src={`${STATIC_HOST_NO_SPLASH + user?.profile_picture}`}
                                            alt="avatar"
                                            className=" cursor-pointer object-cover w-[45px] h-[45px] border rounded-full"
                                        />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="bottom" align="end">
                                        <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="cursor-pointer flex gap-2">
                                            <Link to="/settings/profile">
                                                <div className="flex flex-row cursor-pointer items-center gap-2">
                                                    <SquareUserRound />
                                                    Thông tin cá nhân
                                                </div>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="">
                                            <Link to="/home">
                                                <div className="flex flex-row cursor-pointer items-center gap-2">
                                                    <Settings />
                                                    Cài đặt
                                                </div>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => setOpenAlertLogout(true)}
                                            className="cursor-pointer flex gap-2"
                                        >
                                            <LogOut />
                                            Đăng xuất
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <AlertDialog
                                    open={openAlertLogout}
                                    onOpenChange={setOpenAlertLogout}
                                >
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Bạn có chắc muốn đăng xuất?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Đăng xuất xong bạn sẽ không thể thao tác với dữ liệu
                                                của ứng dụng
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleLogout}>
                                                Đăng xuất
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </>
                </div>
            </div>
        </div>
    );
};
