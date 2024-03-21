import authApi from '@/api/authApi';
import { CalendarTypingField, SelectionField, TextField } from '@/components/FormControls';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { SelectItem } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tag, TagInput } from '@/components/ui/tag-input';
import { useToast } from '@/components/ui/use-toast';
import { jobSkills, STATIC_HOST_NO_SPLASH } from '@/constants';
import { useInfoUser } from '@/hooks';
import { InfoUser, UserUpdateForm } from '@/models';
import { yupResolver } from '@hookform/resolvers/yup';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Pencil } from 'lucide-react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import { authActions } from '../auth/AuthSlice';
export const Profile = () => {
    const user = useInfoUser();
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { toast } = useToast();
    const [tags, setTags] = useState<Tag[]>([]);
    const [tag2s, setTag2s] = useState<Tag[]>([]);

    useEffect(() => {
        if (user) {
            formEdit.setValue('email', String(user.email));
            formEdit.setValue('full_name', user.full_name);
            formEdit.setValue('date_of_birth', user.date_of_birth);
            formEdit.setValue('phone_number', user.phone_number);
            formEdit.setValue('address', user.address);
            formEdit.setValue('facebook', user.facebook);
            formEdit.setValue('instagram', user.instagram);
            formEdit.setValue('linkedin', user.linkedin);
            formEdit.setValue('education', user.education);
            formEdit.setValue('work_experience', user.work_experience);
            formEdit.setValue('skills', user.skills);
            formEdit.setValue('activities', user.activities);
            formEdit.setValue('certificates', user.certificates);
            formEdit.setValue('awards', user.awards);
            if(user?.activities){
                const x=user?.activities.split(',').map((data:string,i:number)=>({id:i,text:data})) as unknown as Tag[]
                setTag2s(x)
            }
            if(user?.skills){
                const x=user?.skills.split(',').map((data:string,i:number)=>({id:i,text:data})) as unknown as Tag[]
                setTags(x)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const schema_edit = yup.object().shape({
        email: yup.string().email().required(),
        full_name: yup.string().required(),
        date_of_birth: yup.string().required(),
        phone_number: yup.string().required(),
        education: yup.string().required(),
        work_experience: yup.string().required(),
    });
    const formEdit = useForm<UserUpdateForm>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: yupResolver(schema_edit),
    });
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImageData(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleEditButtonClick = () => {
        // Khi người dùng nhấn nút chỉnh sửa, gọi click() trên input để mở hộp thoại chọn tệp
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const [imageData, setImageData] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleEdit: SubmitHandler<UserUpdateForm> = (data) => {
        (async () => {
            try {
                setLoading(true);
                console.log(data);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const reData: any = {
                    ...data,
                };
                if (imageData) {
                    reData.profile_picture = imageData;
                }
                const res = await authApi.updateInfo(reData);
                console.log(res);
                dispatch(authActions.setUser(res as unknown as InfoUser));

                setImageData(null);
                toast({
                    title: 'Thành công',
                    description: 'Sửa thông tin thành công',
                });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                toast({
                    variant: 'destructive',
                    title: 'Có lỗi xảy ra',
                    description: error.error,
                });
            } finally {
                setLoading(false);
            }
        })();
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Thông tin cá nhân</h3>
                <p className="text-sm text-muted-foreground">
                    Sửa đổi cập nhật thông tin không chỉ liên quan đến cá nhân mà còn liên quan đến
                    công việc
                </p>
            </div>
            <Separator />
            <div />
            <Form {...formEdit}>
                <form onSubmit={formEdit.handleSubmit(handleEdit)}>
                    <div className="flex flex-row gap-10">
                        <div>
                            <div className="ml-1 mr-3">
                                <div className="mb-3">
                                    <p className="mb-2 text-lg font-semibold">Thông tin chung</p>
                                    <div className="grid grid-cols-3 gap-3 mb-3">
                                        <TextField
                                            name="full_name"
                                            label="Tên đầy đủ"
                                            placeholder="Nhập tên đầy đủ"
                                            require={true}
                                        />
                                        <TextField
                                            name="email"
                                            label="Gmail"
                                            placeholder="Nhập gmail"
                                            require={true}
                                            type="email"
                                        />
                                        <CalendarTypingField
                                            name="date_of_birth"
                                            label="Ngày sinh"
                                            require={true}
                                        />
                                        <TextField
                                            name="phone_number"
                                            label="Số điện thoại"
                                            placeholder="Nhập số điện thoại"
                                            require={true}
                                        />
                                        <TextField
                                            name="education"
                                            label="Học vấn"
                                            require={true}
                                            placeholder="Nhập trường học,bằng cấp"
                                        />

                                        <TextField
                                            name="address"
                                            label="Địa chỉ"
                                            placeholder="Nhập địa chỉ liên hệ"
                                            require={true}
                                        />
                                        <TextField
                                            name="facebook"
                                            label="Facebook"
                                            placeholder="Dán link facebook của bạn"
                                        />
                                        <TextField
                                            name="instagram"
                                            label="instagram"
                                            placeholder="Dán link instagram của bạn"
                                        />
                                        <TextField
                                            name="linkedin"
                                            label="Linkedin"
                                            placeholder="Dán link linkedin của bạn"
                                        />
                                    </div>
                                    <p className="mb-2 text-lg font-semibold">
                                        Thông tin công việc
                                    </p>
                                    <div>
                                        <div className="grid grid-cols-2 gap-3 mb-3">
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
                                            <TextField
                                                name="certificates"
                                                label="Bằng cấp"
                                                placeholder="Nhập bằng cấp của bạn"
                                            />
                                            <TextField
                                                name="awards"
                                                label="Giải thưởng"
                                                placeholder="Liệt kê giải nhất abc, giải nhì xyz..."
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 items-end gap-3">
                                            <TagInput
                                                name="skills"
                                                label="Kỹ năng"
                                                placeholder="Enter để tạo (VD: Lãnh đạo, Làm việc nhóm,...)"
                                                tags={tags}
                                                autocompleteOptions={jobSkills}
                                                setTags={(newTags) => {
                                                    setTags(newTags);
                                                    const tag = newTags as Tag[];
                                                    formEdit.setValue(
                                                        'skills',
                                                        tag.map((x) => x.text).join(',')
                                                    );
                                                }}
                                            />
                                            <TagInput
                                                name="activities"
                                                label="Hoạt động"
                                                placeholder="Enter để tạo (VD: Học Đại học Thăng Long vào 2021,...)"
                                                tags={tag2s}
                                                autocompleteOptions={jobSkills}
                                                setTags={(newTags) => {
                                                    setTag2s(newTags);
                                                    const tag = newTags as Tag[];
                                                    formEdit.setValue(
                                                        'activities',
                                                        tag.map((x) => x.text).join(',')
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-start my-4 mr-3">
                                <p className="text-muted-foreground text-sm mb-3">
                                    Lưu ý: Tất cả các trường trên trang này là tùy chọn và có thể bị
                                    xóa bất kỳ lúc nào và bằng cách điền vào chúng, bạn đồng ý cho
                                    chúng tôi chia sẻ dữ liệu này cho người quản lí và những người
                                    sử dụng trang web.
                                </p>
                                <Button type="submit">
                                    {loading && (
                                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                    )}{' '}
                                    Cập nhật hồ sơ
                                </Button>
                            </div>
                        </div>
                        <div className="relative ml-20 w-fit h-fit">
                            <Avatar className="w-[150px] border h-[150px]">
                                <AvatarImage
                                    className="object-cover"
                                    src={`${
                                        imageData || STATIC_HOST_NO_SPLASH + user?.profile_picture
                                    }`}
                                />
                                <AvatarFallback>{user?.full_name}</AvatarFallback>
                            </Avatar>
                            <Button
                                className="absolute px-2 bottom-[0px] left-[-30px] bg-white dark:bg-secondary"
                                variant="outline"
                                type="button"
                                size="sm"
                                onClick={handleEditButtonClick}
                            >
                                <Pencil className="mr-1 w-[15px]" /> Chỉnh sửa
                                <input
                                    hidden
                                    onChange={handleFileChange}
                                    type="file"
                                    accept="image/*"
                                    multiple={false}
                                    ref={fileInputRef}
                                />
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
};
