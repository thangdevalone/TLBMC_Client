import courseApi from '@/api/courseApi';
import { TextareaField, TextField } from '@/components/FormControls';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { CreateCourseForm } from '@/models';
import { yupResolver } from '@hookform/resolvers/yup';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Upload } from 'lucide-react';
import { ChangeEvent, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';

export const ManagerCourse = () => {
    const [imageData, setImageData] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const schema = yup.object().shape({
        title: yup.string().required('Cần nhập tên khóa học'),
        description: yup.string().optional(), // Trường description có thể có hoặc không
        link: yup.string().required('Cần nhập link khóa học'),
    });
    const { toast } = useToast();
    const form = useForm<CreateCourseForm>({
        resolver: yupResolver(schema),
    });
    const handleCreateCourse: SubmitHandler<CreateCourseForm> = (data) => {
        (async () => {
            try {
                setLoading(true);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const reData: any = data;
                if (imageData) {
                    reData.image = imageData;
                }
                else{
                    toast({
                        variant: 'destructive',
                        title: 'Cần tải ảnh',
                    });
                    return;
                }
                await courseApi.postCourse(reData);
                form.reset({
                    link:'',
                    title:'',
                    description:''
                });
                setImageData(null)
                toast({
                    variant: 'default',
                    title: 'Tạo khóa học thành công',
                });
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        })();
    };
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setImageData(reader.result as string);
        };
        reader.readAsDataURL(file);
    };
    const handleButtonClick = () => {
        // Khi người dùng nhấn nút chỉnh sửa, gọi click() trên input để mở hộp thoại chọn tệp
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    return (
        <div className=" h-full mb-5">
            <p className="text-lg font-medium">Tải lên khóa học</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreateCourse)}>
                    <div className="grid w-full  gap-5 grid-cols-2">
                        <div>
                            <TextField
                                name="title"
                                label="Tên khóa học"
                                placeholder="Nhập tên khóa học"
                                require={true}
                            />
                            <TextField
                                name="link"
                                label="Link tới khóa học"
                                placeholder="https://abc.com"
                                require={true}
                            />
                            <Button
                                    className="my-3 bg-white dark:bg-secondary"
                                    variant="outline"
                                    type="button"
                                    size="sm"
                                    onClick={handleButtonClick}
                                >
                                    <Upload className="mr-1 w-[15px]" /> Tải ảnh khóa học
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
                        {imageData && (
                            <div className=" space-y-2">
                                <b>Preview image:</b>
                                <div>
                                    <img className="object-cover w-[300px]" src={imageData} />
                                </div>
                                
                            </div>
                        )}
                    </div>

                    <div className="max-w-[500px]">
                        <TextareaField
                            name="description"
                            label="Mô tả"
                            placeholder="Nhập mô tả về khóa học"
                        />
                    </div>
                    <Button className="mt-3" type="submit">
                        {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />} Tạo khóa
                        học
                    </Button>
                </form>
            </Form>
        </div>
    );
};
