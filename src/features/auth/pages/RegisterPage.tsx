import authApi from '@/api/authApi';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
    CalendarTypingField,
    OtpField,
    PasswordField,
    SelectionField,
    TextField,
} from '@/components/FormControls';
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
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SelectItem } from '@/components/ui/select';
import { Tag, TagInput } from '@/components/ui/tag-input';
import { useToast } from '@/components/ui/use-toast';
import { jobSkills } from '@/constants';
import { RegisterForm_1, RegisterForm_2 } from '@/models';
import { yupResolver } from '@hookform/resolvers/yup';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { authActions } from '../AuthSlice';
interface otp {
    otp: string;
}
export function RegisterPage() {
    const dispatch = useAppDispatch();
    const { actionAuth, registering } = useAppSelector((state) => state.auth);
    const { toast } = useToast();
    const [tags, setTags] = useState<Tag[]>([]);
    const phoneRegExp =
        /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

    const schema_1 = yup.object().shape({
        full_name: yup.string().required('Cần nhập tên đầy đủ'),
        date_of_birth: yup.string().required('Cần nhập ngày sinh'),
        address: yup.string().required('Cần nhập địa chỉ'),
        education: yup.string().required('Nhập trường của bạn'),
        work_experience: yup.string().required('Chọn kinh nghiệm làm việc'),
        phone_number: yup
            .string()
            .required('Điền số điện thoại')
            .matches(phoneRegExp, 'Số điện thoại không hợp lệ')
            .min(9, 'Quá ngắn')
            .max(11, 'Quá dài'),
    });
    const schema_2 = yup.object().shape({
        email: yup.string().required('Cần nhập gmail'),
        password: yup
            .string()
            .required('Cần nhập mật khẩu')
            .min(6, 'Mật khẩu phải dài hơn 6 kí tự')
            .max(32, 'Mật khẩu quá dài')
            .matches(/[A-Z]+/, 'Mật khẩu cần ít nhất 1 kí tự in hoa'),

        re_pass: yup
            .string()
            .required('Nhập lại mật khẩu')
            .oneOf([yup.ref('password')], 'Mật khẩu không khớp'),
    });
    const [alert, setAlert] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const form_1 = useForm<RegisterForm_1>({
        resolver: yupResolver(schema_1),
    });
    const form_2 = useForm<RegisterForm_2>({
        resolver: yupResolver(schema_2),
    });
    const schemaotp = yup.object().shape({
        otp: yup.string().length(6, 'OTP bao gồm 6 kí tự').required('Cần nhập mã OTP'),
    });
    const otpForm = useForm<otp>({
        resolver: yupResolver(schemaotp),
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [form1Data, setForm1Data] = useState<any>();
    const handleRegister1: SubmitHandler<RegisterForm_1> = (data) => {
        // dispatch(authActions.register(data));
        if (data) {
            setForm1Data(data);
        }
        setStep(2);
    };
    useEffect(() => {
        if (actionAuth == 'Failed') {
            toast({
                title: 'Xác thực thất bại',
                description: 'Mã OTP không chính xác',
                variant: 'destructive',
            });
        }
    }, [actionAuth, toast]);

    const handleRegister2: SubmitHandler<RegisterForm_2> = (data) => {
        (async () => {
            try {
                setLoading(true);
                const pData = { ...form1Data, ...data };
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { re_pass, ...formData } = pData;
                await authApi.sendOtp(formData);
                setStep(3);
            } catch (error) {
                toast({
                    title: 'Đăng ký thất bại',
                    description: 'Gmail đã được đăng kí',
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        })();
    };
    const handleSendOTP: SubmitHandler<otp> = (data) => {
        dispatch(authActions.register({ otp: data.otp, email: form_2.getValues('email') }));
    };
    const [step, setStep] = useState(1);

    return (
        <>
            <div className="lg:p-8 p-5 lg mt-10">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Đăng kí</h1>
                    <p className="text-sm text-muted-foreground">
                        Nhập thông tin và mật khẩu để đăng ký
                    </p>
                </div>
                <div className="w-full flex justify-center">
                    <ol className="flex items-center gap-y-1.5 ssm:my-3  my-8  smm:flex-wrap xl:w-[800px] md:w-[700px]  w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
                        <li
                            className={`flex md:w-full items-center ${
                                step == 1 && 'text-blue-600 dark:text-blue-500'
                            } sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}
                        >
                            <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                                {step !== 1 ? (
                                    <span className="me-2 smm:p-2 smm:rounded-full">1</span>
                                ) : (
                                    <svg
                                        className="w-6 h-6 md:w-6 md:h-6 me-1.5"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                    </svg>
                                )}
                                <span className="ms-1 sm:inline-flex sm:ms-2">Thông</span>
                                <span className="ms-1 sm:inline-flex sm:ms-2">Tin</span>
                                <span className="ms-1 sm:inline-flex sm:ms-2">Cá</span>
                                <span className="ms-1 sm:inline-flex sm:ms-2">nhân</span>
                            </span>
                        </li>
                        <li
                            className={`flex md:w-full ${
                                step == 2 && 'text-blue-600 dark:text-blue-500'
                            } items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700`}
                        >
                            <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                                {step !== 2 ? (
                                    <span className="me-2  smm:px-[6px] smm:border smm:rounded-full">
                                        2
                                    </span>
                                ) : (
                                    <svg
                                        className="w-5 h-5 md:w-6 md:h-6 me-2.5"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                    </svg>
                                )}
                                <span className="ms-1 sm:inline-flex sm:ms-2">Thông</span>
                                <span className="ms-1 sm:inline-flex sm:ms-2">Tin</span>
                                <span className="ms-1 sm:inline-flex sm:ms-2">Tài</span>
                                <span className="ms-1 sm:inline-flex sm:ms-2">Khoản</span>
                            </span>
                        </li>
                        <li
                            className={`flex ${
                                step == 3 && 'text-blue-600 dark:text-blue-500'
                            } items-center`}
                        >
                            {step !== 3 ? (
                                <span className="me-2  smm:px-[6px] smm:border smm:rounded-full">
                                    3
                                </span>
                            ) : (
                                <svg
                                    className="w-5 h-5 md:w-6 md:h-6 me-2.5"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                </svg>
                            )}
                            <span className="ms-1 sm:inline-flex sm:ms-2">Xác</span>
                            <span className="ms-1 sm:inline-flex sm:ms-2">Thực</span>
                        </li>
                    </ol>
                </div>
                <div className="mx-auto flex w-full flex-col justify-center space-y-6  xl:w-[500px] md:w-[400px] sm:w-[350px]">
                    {step == 1 && (
                        <Form {...form_1}>
                            <form
                                onSubmit={form_1.handleSubmit(handleRegister1)}
                                className="space-y-4"
                            >
                                <TextField
                                    name="full_name"
                                    label="Tên đầy đủ"
                                    placeholder="Nhập tên đầy đủ của bạn"
                                    require={true}
                                />
                                <div className="grid gap-3 grid-cols-2">
                                    <TextField
                                        name="phone_number"
                                        label="Số điện thoại"
                                        placeholder="Nhập số điện thoại"
                                        require={true}
                                    />
                                    <CalendarTypingField
                                        name="date_of_birth"
                                        label="Ngày sinh"
                                        require={true}
                                    />
                                    <TextField
                                        name="education"
                                        label="Học vấn"
                                        require={true}
                                        placeholder="Nhập trường học,bằng cấp"
                                    />
                                    <SelectionField
                                        label="Kinh nghiệm làm việc"
                                        name="work_experience"
                                        placeholder="Chọn số năm"
                                        require={true}
                                    >
                                        <SelectItem value="Chưa có kinh nghiệm">
                                            Chưa có kinh nghiệm
                                        </SelectItem>
                                        <SelectItem value="< 1 năm">&lt; 1 năm</SelectItem>
                                        <SelectItem value="1-2 năm">1-2 năm</SelectItem>
                                        <SelectItem value="3-5 năm">3-5 năm</SelectItem>
                                        <SelectItem value="5+ năm">5+ năm</SelectItem>
                                    </SelectionField>
                                </div>
                                <TextField
                                    name="address"
                                    label="Địa chỉ"
                                    placeholder="Nhập địa chỉ liên hệ"
                                    require={true}
                                />
                                <TagInput
                                    name="skills"
                                    label="Kỹ năng"
                                    placeholder="Nhập enter để thêm mới (VD: Lãnh đạo, Làm việc nhóm,...)"
                                    tags={tags}
                                    autocompleteOptions={jobSkills}
                                    setTags={(newTags) => {
                                        setTags(newTags);
                                        const tag = newTags as Tag[];
                                        form_1.setValue('skills', tag.map((x) => x.text).join(','));
                                    }}
                                />
                                <Button type="submit" className="w-full ">
                                    Tiếp tục với đăng ký
                                </Button>
                            </form>
                        </Form>
                    )}
                    {step == 2 && (
                        <Form {...form_2}>
                            <form
                                onSubmit={form_2.handleSubmit(handleRegister2)}
                                className="space-y-4"
                            >
                                <TextField
                                    name="email"
                                    label="Gmail"
                                    require={true}
                                    placeholder="Nhập gmail của bạn"
                                />
                                <PasswordField
                                    name="password"
                                    label="Mật khẩu"
                                    placeholder="Nhập mật khẩu"
                                    require={true}
                                    autoComplete={''}
                                />
                                <PasswordField
                                    name="re_pass"
                                    label="Nhập lại mật khẩu"
                                    require={true}
                                    placeholder="Nhập lại mật khẩu"
                                    autoComplete={''}
                                />
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        variant="outline"
                                        className="w-full "
                                    >
                                        Trở lại
                                    </Button>
                                    <Button
                                        type="submit"
                                        onClick={() => form_2.handleSubmit(handleRegister2)}
                                        disabled={loading}
                                        className="w-full "
                                    >
                                        {loading && (
                                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                        )}{' '}
                                        {loading ? 'Chờ gửi OTP' : 'Xác thực tài khoản'}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    )}
                    {step == 3 && (
                        <Form {...otpForm}>
                            <form
                                onSubmit={otpForm.handleSubmit(handleSendOTP)}
                                className="space-y-4"
                            >
                                <div className="flex flex-row">
                                    <OtpField
                                        require={true}
                                        label="Nhập OTP được gửi vào gmail của bạn"
                                        name="otp"
                                    />
                                </div>
                                <div className="flex flex-row gap-3">
                                    {/* <Button
                                        type="button"
                                        disabled={loading}
                                        onClick={() => form_2.handleSubmit(handleRegister2)}
                                        variant="outline"
                                        className="w-full "
                                    >
                                        <ReloadIcon
                                            className={`mr-2 h-4 w-4 ${loading && 'animate-spin'}`}
                                        />
                                        Gửi lại mã
                                    </Button> */}
                                    <Button
                                        type="submit"
                                        disabled={registering}
                                        className="w-full "
                                    >
                                        {registering && (
                                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                        )}{' '}
                                        Xác thực
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    )}
                </div>
                <AlertDialog open={alert} onOpenChange={setAlert}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Xác thực OTP</AlertDialogTitle>
                            <AlertDialogDescription>
                                Link đổi mật khẩu sẽ được gửi về gmail của bạn. Truy cập vào gmail
                                để đổi mật khẩu
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <Form {...otpForm}>
                            <form onSubmit={otpForm.handleSubmit(handleSendOTP)}>
                                <FormField
                                    name="otp"
                                    control={otpForm.control}
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
                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                    <Button disabled={loading2} type="submit">
                                        {loading2 && (
                                            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        Xác nhận
                                    </Button>
                                </AlertDialogFooter>
                            </form>
                        </Form>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </>
    );
}
