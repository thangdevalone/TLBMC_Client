import { ModeToggle } from '@/components/mode-toggle';

import authApi from '@/api/authApi';
import { useAppSelector } from '@/app/hooks';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputPassword } from '@/components/ui/inputPassword';
import { useToast } from '@/components/ui/use-toast';
import { LoginForm } from '@/models';
import { yupResolver } from '@hookform/resolvers/yup';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { authActions } from '../AuthSlice';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
interface GmailForm {
    email: string;
}

export function LoginPage() {
    const dispatch = useDispatch();
    const { actionAuth, logging } = useAppSelector((state) => state.auth);
    const { toast } = useToast();

    const schema = yup.object().shape({
        email: yup.string().required('Cần nhập gmail'),
        password: yup.string().required('Cần nhập mật khẩu'),
    });
    const navigate=useNavigate()
    const [alert, setAlert] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const form = useForm<LoginForm>({
        resolver: yupResolver(schema),
        defaultValues: {
            email: '',
            password: '',
        },
    });
    const handleLogin: SubmitHandler<LoginForm> = (data) => {
        dispatch(authActions.login(data));
    };
    useEffect(() => {
        if (actionAuth == 'Failed') {
            toast({
                title: 'Đăng nhập thất bại',
                description: 'Tài khoản hoặc mật khẩu không chính xác',
                variant: 'destructive',
            });
        }
    }, [actionAuth, toast]);

    // const handleSendGmail: SubmitHandler<GmailForm> = (data) => {
    //     (async () => {
    //         try {
    //             if (data.email) {
    //                 setLoading2(true);
    //                 await authApi.forgotPass(data.email);
    //                 toast({
    //                     title: 'Thành công',
    //                     description: 'Link đổi mật khẩu đã được gửi vào gmail của bạn',
    //                 });
    //                 setAlert(false);
    //             }
    //             // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //         } catch (error: any) {
    //             toast({
    //                 variant: 'destructive',
    //                 title: 'Có lỗi xảy ra',
    //                 description: error.error,
    //             });
    //         } finally {
    //             setLoading2(false);
    //         }
    //     })();
    // };

    const gmail_schema = yup.object().shape({
        email: yup.string().email().required('Cần nhập gmail'),
    });

    const gmailForm = useForm<GmailForm>({
        resolver: yupResolver(gmail_schema),
    });
    return (
        <>
            <div className="absolute top-[20px] right-[20px] z-20">
                <ModeToggle />
            </div>
            <div className="container relative grid h-full flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r  lg:flex">
                    <div className="absolute inset-0 bg-cover" style={{background:"url('/assets/bg.avif')",backgroundSize:"cover"}} />
                    <div className="relative z-20 flex items-center text-lg font-medium">
                        {/* <img
                            src="/assets/logo.png"
                            alt="logo"
                            className="w-[300px]"
                        /> */}
                        <Link to={'/'} className='flex gap-3 items-center'>
                        <ArrowLeft/> Trang chủ
                        </Link>
                    </div>
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg">
                                &ldquo;Chào mừng bạn đã tới … một nền tảng hỗ trợ cho việc học tập, kết nối bạn bè và nâng cao kiến thức về những lĩnh vực mà bạn đang học tập hoặc quan tâm. Tại …. bạn có thể gặp được những teammate cực kỳ “matching”,  bật bộ lọc để tìm kiếm trong trường Đại học mà bạn đang học hoặc cũng có thể kết nối với các bạn học sinh, sinh viên khác ngoài khu vực.. Các bạn có thể kết bạn, tạo nhóm chung để học tập, chia sẻ tài liệu, thậm chí là video call trực tuyến.&rdquo;
                            </p>
                            <footer className="text-sm">3 Mũi Tên</footer>
                        </blockquote>
                    </div>
                </div>
                <div className="lg:p-8 -translate-y-[50px]">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        <div className="flex flex-col space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight">Đăng nhập</h1>
                            <p className="text-sm text-muted-foreground">
                                Nhập tên gmail và mật khẩu để tiếp tục
                            </p>
                        </div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gmail</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Nhập gmail của bạn"
                                                    {...field}
                                                    autoComplete="email"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mật khẩu</FormLabel>
                                            <FormControl>
                                                <InputPassword
                                                    placeholder="Nhập mật khẩu"
                                                    {...field}
                                                    autoComplete="password"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <p
                                    onClick={() => setAlert(true)}
                                    className="underline w-full text-end italic text-sm cursor-pointer"
                                >
                                    Quên mật khẩu?
                                </p>

                                <Button type="submit" disabled={logging} className="w-full ">
                                    {logging && (
                                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                    )}{' '}
                                    Đăng nhập
                                </Button>
                                <p
                                    onClick={() => navigate("/register")}
                                    className="underline w-full text-end italic text-sm cursor-pointer"
                                >
                                    Chưa có tài khoản? Đăng ký ngay
                                </p>
                            </form>
                        </Form>
                    </div>
                </div>
                {/* <AlertDialog open={alert} onOpenChange={setAlert}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Quên mật khẩu</AlertDialogTitle>
                            <AlertDialogDescription>
                                Link đổi mật khẩu sẽ được gửi về gmail của bạn. Truy cập vào gmail
                                để đổi mật khẩu
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <Form {...gmailForm}>
                            <form onSubmit={gmailForm.handleSubmit(handleSendGmail)}>
                                <FormField
                                    name="email"
                                    control={gmailForm.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    {...field}
                                                    placeholder="Nhập gmail của bạn"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <AlertDialogFooter className="mt-4">
                                    <AlertDialogCancel>Đóng</AlertDialogCancel>
                                    <Button disabled={loading2} type="submit">
                                        {loading2 && (
                                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Gửi
                                    </Button>
                                </AlertDialogFooter>
                            </form>
                        </Form>
                    </AlertDialogContent>
                </AlertDialog> */}
            </div>
        </>
    );
}
