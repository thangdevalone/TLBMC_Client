/* eslint-disable @typescript-eslint/no-explicit-any */
import authApi from '@/api/authApi';
import postApi from '@/api/postApi';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Icons } from '@/components/icons';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { SOCKET_URL, STATIC_HOST_NO_SPLASH } from '@/constants';
import StorageKeys from '@/constants/storage-keys';
import { authActions } from '@/features/auth/AuthSlice';
import { useInfoUser } from '@/hooks';
import { cn } from '@/lib/utils';
import { ImageDel, InfoPost } from '@/models';
import { convertUser } from '@/utils';
import { ReloadIcon } from '@radix-ui/react-icons';
import { format, formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
    Facebook,
    Globe,
    Heart,
    Instagram,
    Layers3,
    Linkedin,
    Loader,
    Pencil,
    Plus,
    Search,
    Send,
    Share2,
    User,
} from 'lucide-react';
import React, { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link, useNavigate } from 'react-router-dom';
export const NewsFeed = () => {
    const user = useInfoUser();
    const [editorHtml, setEditorHtml] = useState('');
    const handleChange = (html: string) => {
        setEditorHtml(html);
    };
    const [previewImage, setPreviewImage] = useState<ImageDel[]>(user?.related_images || []);
    const [commentOpen, setCommentOpen] = useState(-1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ref = useRef<any>(null);
    const [loadingCmt,setLoadingCmt] =useState(false)
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [valueComment, setValueComment] = useState('');
    const [valueRep, setValueRep] = useState('');
    const inputRefs = useRef<Array<React.RefObject<HTMLInputElement>>>(
        Array.from({ length: 9 }).map(() => React.createRef())
    );
    const [alertData, setAlertData] = useState<any>();
    const [openAlert, setOpenAlert] = useState(false);
    const handleClick = (index: number) => {
        const inputRef = inputRefs.current[index];
        if (inputRef && inputRef.current) {
            inputRef.current.click();
        }
    };
    const navDel = () => {
        if (alertData&& alertData.type === 'cmt') {
            handleDelCom(alertData.id);
        } else {
            handleDelPost(alertData.id);
        }
    };
    const dispatch = useAppDispatch();
    const handleFileChange = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput) {
            const file = fileInput.files?.[0];
            if (file) {
                const reader = new FileReader();

                reader.onload = async (event) => {
                    const imageUrl = (event.target as FileReader).result as string;

                    try {
                        const res = (await authApi.uploadRelated({
                            image: imageUrl,
                            pos: index,
                        })) as unknown as ImageDel[];
                        toast({
                            variant: 'default',
                            title: 'Tải ảnh thành công',
                        });
                        setPreviewImage(res);
                        dispatch(authActions.setUser({ related_images: res }));
                    } catch (error) {
                        console.log(error);
                    }
                };

                // Đọc tệp hình ảnh dưới dạng base64
                reader.readAsDataURL(file);
            }
        }
    };
    const token = localStorage.getItem(StorageKeys.TOKEN);
    useEffect(() => {
        fetchPosts()
        const ws = new WebSocket(SOCKET_URL + 'ws/comments?token=' + token);
        setSocket(ws);
        ws.onmessage = handleMessage;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [posts, setPosts] = useState<InfoPost[]>();
    const [postDialog, setPostDialog] = useState(false);
    const [global, setGlobal] = useState(true);
    const fetchPosts = async () => {
        try {
            const data = (await postApi.getNew()) as unknown as InfoPost[];
            setPosts(data);
        } catch (error) {
            console.log(error);
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleMessage = (_message: { data: string }) => {
        console.log(_message.data)
        setLoadingCmt(false)
        setLoadingRep(false)
        fetchPosts();
    };
    const modules = {
        toolbar: {
            container: [
                [{ header: [1, 2, false] }],
                ['bold', 'italic', 'underline', 'blockquote'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'], // Thêm nút image vào thanh công cụ
            ],
        },
    };
    const handleLike = (idPost: number) => {
        (async () => {
            try {
                await postApi.likeNew(idPost);
                fetchPosts();
            } catch (error) {
                console.log(error);
            }
        })();
    };
    useEffect(() => {
        fetchPosts();
    }, []);

    const [posting, setPosting] = useState(false);
    const [repOpen, setRepOpen] = useState(false);

    const { toast } = useToast();
    const handlePost = () => {
        (async () => {
            try {
                setPosting(true);
                await postApi.postNew({
                    content: editorHtml.replace(/<p><br><\/p>/g, ''),
                    global_post: global,
                });
                fetchPosts();
                setPostDialog(false);
                toast({
                    variant: 'default',
                    title: 'Đăng bài viết thành công',
                });
            } catch (error) {
                toast({
                    variant: 'destructive',
                    title: 'Đăng bài viết không thành công',
                });
            } finally {
                setPosting(false);
            }
        })();
    };
    const handleLikeComment = async (cmtid: number) => {
        try {
            await postApi.likeComment(cmtid);
            fetchPosts();
            setAlertData(undefined);
            setOpenAlert(false)
            toast({
                title:"Xóa bình luận thành công"
            })

        } catch (error) {
            console.log(error);
        }
    };
    const handleCommentSubmit = (data: any) => {
        // Thực hiện xử lý khi người dùng nhấn phím Enter
        // Đặt newComment về trạng thái ban đầu hoặc thực hiện hành động khác
        setLoadingCmt(true)
        if (socket) {
            socket.send(JSON.stringify(data));
        }
        setValueComment('');
    };
    const [loadingRep,setLoadingRep]=useState(false)
    const handleRepSubmit = (data: any) => {
        // Thực hiện xử lý khi người dùng nhấn phím Enter
        // Đặt newComment về trạng thái ban đầu hoặc thực hiện hành động khác
        setLoadingRep(true)
        if (socket) {
            socket.send(JSON.stringify(data));
        }
        setValueRep('');
    };
    const handleCommentChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValueComment(event.target.value);
    };
    const { width } = useAppSelector((state) => state.app);
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>, data: InfoPost) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Ngăn chặn hành động mặc định của phím Enter (ví dụ: submit form)
            handleCommentSubmit({ comment: valueComment, post_id: data.id });
        }
    };
    const handleRepChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValueRep(event.target.value);
    };
    const handleDelPost = (id: number) => {
        (async () => {
            try {
                await postApi.delNew(id);
                fetchPosts();
                setAlertData(undefined)
                setOpenAlert(false)
                toast({
                    title:"Xóa bài viết thành công"
                })
            } catch (error) {
                console.log(error);
            }
        })();
    };
    const handleDelCom = (id: number) => {
        (async () => {
            try {
                await postApi.delCom(id);
                fetchPosts();
            } catch (error) {
                console.log(error);
            }
        })();
    };
    const handleKeyDownRep = (event: KeyboardEvent<HTMLInputElement>, data: any, p: number) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Ngăn chặn hành động mặc định của phím Enter (ví dụ: submit form)
            handleRepSubmit({ comment: valueRep, rep_id: data.id, post_id: p });
        }
    };
    const navigate = useNavigate();
    return (
        <div className="container mt-4 mb-[60px]">
            <div className={cn('grid  gap-6', width > 1200 ? 'grid-cols-4' : 'grid-cols-6')}>
                <div className={cn(width > 1200 ? 'col-span-1' : 'col-span-2')}>
                    <div className="bg-background rounded-md pb-5 shadow-md overflow-hidden relative">
                        <div className="w-full h-[50px]  bg-[#A454BB] border-b-2 "></div>
                        <img
                            src={`${STATIC_HOST_NO_SPLASH + user?.profile_picture}`}
                            className="rounded-full absolute top-[10px] left-[50%] -translate-x-1/2 w-[70px] h-[70px] object-cover border-2 "
                        />
                        <p className="mt-10 font-medium text-lg text-center">{user?.full_name}</p>
                        <p className="mt-1 text-gray-500 text-sm text-center">
                            Làm việc tại {user?.education}
                        </p>
                        <div className="mx-4 mt-5">
                            <p className="text-sm font-medium dark:text-gray-400 text-gray-600">
                                Kỹ năng:
                            </p>
                            <p className="mt-1 text-sm">{user?.skills || 'Chưa có'}</p>
                            <p className="text-sm mt-2 font-medium dark:text-gray-400 text-gray-600">
                                Liên kết xã hội:
                            </p>

                            {user?.facebook || user?.instagram || user?.linkedin ? (
                                <>
                                    {user?.facebook && (
                                        <p className="mt-1 flex flex-row gap-2 text-sm line-clamp-1">
                                            <Facebook size={20} className="w-[20px]" />{' '}
                                            <Link
                                                to={user?.facebook}
                                                target="_blank"
                                                className="hover:underline  min-w-[20px]"
                                            >
                                                {user?.facebook}
                                            </Link>
                                        </p>
                                    )}
                                    {user?.linkedin && (
                                        <p className="mt-1 flex flex-row gap-2 text-sm">
                                            <Linkedin size={20} />{' '}
                                            <Link
                                                to={user?.linkedin}
                                                target="_blank"
                                                className="hover:underline min-w-[20px]"
                                            >
                                                {user?.linkedin}
                                            </Link>
                                        </p>
                                    )}
                                    {user?.instagram && (
                                        <p className="mt-1 flex flex-row gap-2 text-sm">
                                            <Instagram size={20} />{' '}
                                            <Link
                                                to={user?.instagram}
                                                target="_blank"
                                                className="hover:underline  min-w-[20px]"
                                            >
                                                {user?.instagram}
                                            </Link>
                                        </p>
                                    )}
                                </>
                            ) : (
                                'Chưa có'
                            )}
                            <p className="text-sm mt-2 font-medium dark:text-gray-400 text-gray-600">
                                Kinh nghiệm làm việc:
                            </p>
                            <p className="mt-1 text-sm">{user?.work_experience || 'Chưa có'}</p>
                            <p className="text-sm mt-2 font-medium text-gray-600 dark:text-gray-400">
                                Ảnh nổi bật:
                            </p>
                            <div className="mt-2">
                                <div className="grid gap-1 grid-cols-3">
                                    {Array.from({ length: 9 }).map((_, index) => {
                                        const selectedImage = previewImage.find(
                                            (item) => item.pos === index
                                        );

                                        return (
                                            <div
                                                key={index}
                                                onClick={() => handleClick(index)}
                                                className="border overflow-hidden flex flex-col items-center justify-center w-full cursor-pointer rounded-md aspect-square border-dashed"
                                            >
                                                {selectedImage ? (
                                                    <img
                                                        src={
                                                            STATIC_HOST_NO_SPLASH +
                                                            selectedImage.image
                                                        }
                                                        alt="Preview"
                                                        className="w-full aspect-square object-cover "
                                                    />
                                                ) : (
                                                    <>
                                                        <Plus size={20} />
                                                        <span className="text-[12px]">
                                                            Thêm ảnh
                                                        </span>
                                                    </>
                                                )}
                                                <input
                                                    ref={inputRefs.current[index]}
                                                    type="file"
                                                    className="hidden"
                                                    multiple={false}
                                                    accept="image/*"
                                                    onChange={(event) =>
                                                        handleFileChange(index, event)
                                                    }
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                                <Input type="upload" className="hidden" />
                            </div>
                            <Button
                                onClick={() => navigate('/settings/profile')}
                                size={'sm'}
                                className="w-full gap-2 text-sm mt-2"
                            >
                                <Pencil size={20} />
                                Chỉnh sửa thông tin cá nhân
                            </Button>
                        </div>
                    </div>
                </div>
                <div className={cn('space-y-4', width > 1200 ? 'col-span-2' : 'col-span-4')}>
                    <div className="rounded-md px-4 pt-3 pb-2 bg-background shadow-md">
                        <Dialog open={postDialog} onOpenChange={setPostDialog}>
                            <div className="flex gap-3 border-b border-gray-300 pb-3 items-center flex-rows">
                                <img
                                    src={`${STATIC_HOST_NO_SPLASH + user?.profile_picture}`}
                                    className="rounded-full  w-[40px] h-[40px] object-cover border "
                                />
                                <DialogTrigger asChild>
                                    <div className="px-4 py-2 dark:bg-[#334257] cursor-pointer bg-slate-200 flex-1 h-fit rounded-3xl">
                                        Chia sẻ về công việc của bản thân...
                                    </div>
                                </DialogTrigger>
                            </div>
                            <div className="grid mt-2 grid-cols-3">
                                <Button
                                    variant="ghost"
                                    onClick={() => fetchPosts()}
                                    className="hover:bg-slate-200 dark:hover:bg-[#334257]"
                                >
                                    <Loader size={20} className="mr-3" />
                                    Tải mới bài viết
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => navigate('/home/learns')}
                                    className="hover:bg-slate-200 dark:hover:bg-[#334257]"
                                >
                                    <Layers3 size={20} className="mr-3" />
                                    Xem khóa học mới
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="hover:bg-slate-200 dark:hover:bg-[#334257]"
                                >
                                    <Search size={20} className="mr-3" />
                                    Tìm kiếm
                                </Button>
                            </div>

                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle className="flex flex-row gap-3 mb-2 items-center">
                                        Tạo bài viết mới{' '}
                                        <Select
                                            defaultValue={'1'}
                                            value={global ? '1' : '0'}
                                            onValueChange={(value) =>
                                                setGlobal(value == '1' ? true : false)
                                            }
                                        >
                                            <SelectTrigger className="w-[120px]">
                                                <SelectValue placeholder="Chọn loại đăng" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">Công khai</SelectItem>
                                                <SelectItem value="0">Bạn bè</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </DialogTitle>
                                    <DialogDescription>
                                        Bài viết mới sẽ được luôn đăng dưới dạng công khai bạn có
                                        thể chọn đăng chế độ dạng bạn bè. Hãy chia sẻ nhưng kỉ niệm
                                        về công việc của bạn
                                    </DialogDescription>
                                </DialogHeader>
                                <ReactQuill
                                    theme="snow"
                                    value={editorHtml}
                                    placeholder="Nhập để tạo bài viết mới của bạn."
                                    onChange={handleChange}
                                    modules={modules}
                                    ref={ref}
                                />
                                <Button
                                    className="mt-2"
                                    onClick={handlePost}
                                    disabled={posting || Boolean(editorHtml.length === 0)}
                                >
                                    {' '}
                                    {posting && (
                                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                    )}{' '}
                                    Đăng bài
                                </Button>
                            </DialogContent>
                        </Dialog>
                    </div>
                    {posts?.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-md px-4 pt-3 pb-2 bg-background shadow-md"
                        >
                            <div className="flex relative gap-2.5 flex-row">
                                <img
                                    src={`${STATIC_HOST_NO_SPLASH + item.author.profile_picture}`}
                                    className="rounded-full  w-[45px] h-[45px] object-cover border "
                                />
                                <div className="flex flex-col justify-between">
                                    {item.author.id === user?.id && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="absolute right-0">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="lucide lucide-ellipsis-vertical"
                                                >
                                                    <circle cx="12" cy="12" r="1" />
                                                    <circle cx="12" cy="5" r="1" />
                                                    <circle cx="12" cy="19" r="1" />
                                                </svg>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                {/* <DropdownMenuItem><Pencil className='mr-2'/> Sửa bài viết</DropdownMenuItem> */}
                                                <DropdownMenuItem
                                                      onClick={() => {
                                                        setAlertData(
                                                            {
                                                                type: 'post',
                                                                id: item.id,
                                                            }
                                                        );
                                                        setOpenAlert(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    Gỡ bài viết
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}

                                    <Tooltip>
                                        <TooltipTrigger>
                                            <span className="font-semibold  text-start  max-w-[350px] line-clamp-1">
                                                {item.author.full_name} - {item.author.education}
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                {item.author.full_name} - {item.author.education}
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <span className="text-gray-500 flex flex-row gap-2 text-[12px]">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="text-gray-500 capitalize hover:underline  cursor-default text-[12px]">
                                                    {formatDistanceToNow(
                                                        new Date(item.created_at),
                                                        {
                                                            locale: vi,
                                                        }
                                                    )}
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                {format(
                                                    new Date(item.created_at),
                                                    "cccc, d 'tháng' M, yyyy 'lúc' HH:mm",
                                                    { locale: vi }
                                                )}
                                            </TooltipContent>
                                        </Tooltip>
                                        <span>·</span>
                                        {item.global_post ? (
                                            <span className="flex items-center flex-row gap-1">
                                                <Globe size={16} /> Công khai
                                            </span>
                                        ) : (
                                            <span className="flex items-center flex-row gap-1">
                                                <User size={16} /> Bạn bè
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div
                                className="mt-2 mb-2"
                                dangerouslySetInnerHTML={{ __html: item.content }}
                            />
                            <div className="flex mb-2 flex-row w-full items-center justify-between">
                                {item.likes.length > 0 ? (
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <span className="flex flex-row gap-1 items-center">
                                                <img
                                                    src="/assets/heart.png"
                                                    className="w-[20px] h-[20px]"
                                                />
                                                <span className="text-gray-500 hover:underline cursor-default text-sm">
                                                    {item.likes.length} Lượt thích
                                                </span>
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <>
                                                {item.likes.slice(0, 10).map((like, index) => (
                                                    <p key={like.id}>
                                                        {index !== 9
                                                            ? convertUser(
                                                                  like.user.id,
                                                                  like.user.full_name,
                                                                  user
                                                              )
                                                            : '...'}
                                                    </p>
                                                ))}
                                            </>
                                        </TooltipContent>
                                    </Tooltip>
                                ) : (
                                    <span className="flex flex-row gap-1 items-center">
                                        <img
                                            src="/assets/heart.png"
                                            className="w-[20px] h-[20px]"
                                        />
                                        <span className="text-gray-500 hover:underline cursor-default text-sm">
                                            Chưa có lượt thích
                                        </span>
                                    </span>
                                )}

                                <span className="flex flex-row gap-1 items-center">
                                    <span className="text-gray-500 text-sm">
                                        {item.comments.length} bình luận
                                    </span>
                                </span>
                            </div>
                            <div className="grid  border-t pt-1 border-gray-300  grid-cols-3">
                                {item.likes.findIndex((item) => item.user.id === user?.id) ===
                                -1 ? (
                                    <Button
                                        onClick={() => handleLike(item.id)}
                                        size={'sm'}
                                        variant="ghost"
                                        className="hover:bg-slate-200 dark:hover:bg-[#334257]"
                                    >
                                        <Heart size={20} className="mr-2" />
                                        Yêu thích
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => handleLike(item.id)}
                                        size={'sm'}
                                        variant="ghost"
                                        className="hover:bg-slate-200  dark:hover:bg-[#334257] hover:text-[#FF3C4C] text-[#FF3C4C]"
                                    >
                                        <Heart
                                            size={20}
                                            fill="#FF3C4C"
                                            stroke="#FF3C4C"
                                            className="mr-2"
                                        />
                                        Yêu thích
                                    </Button>
                                )}
                                <Button
                                    size={'sm'}
                                    onClick={() => {
                                        setCommentOpen(item.id);
                                        // setComments(item.comments);
                                    }}
                                    variant="ghost"
                                    className="hover:bg-slate-200 dark:hover:bg-[#334257]"
                                >
                                    <Icons.comment className="mr-2" />
                                    Bình luận
                                </Button>
                                <Button
                                    size={'sm'}
                                    variant="ghost"
                                    className="hover:bg-slate-200 dark:hover:bg-[#334257]"
                                >
                                    <Share2 size={20} className="mr-2" />
                                    Chia sẻ
                                </Button>
                            </div>
                            {commentOpen === item.id && (
                                <div
                                    className={cn(
                                        'border-t  relative border-gray-300 mt-1',
                                        item.comments.length > 0 ? 'min-h-[150px]' : 'min-h-[60px]'
                                    )}
                                >
                                    {item.comments.length > 0 && (
                                        <div className="max-h-[360px] pb-5 box-s overflow-y-auto overflow-x-hidden">
                                            <p className=" mt-2 font-medium text-gray-600 dark:text-gray-500">
                                                Bình luận:
                                            </p>
                                            <div className="flex flex-col gap-3 mt-3 ">
                                                {item.comments.map((cmt) => (
                                                    <React.Fragment key={cmt.id}>
                                                        {cmt.rep === null && (
                                                            <div
                                                                key={cmt.id}
                                                                    className={cn(
                                                                    'container-chat',
                                                                    repOpen
                                                                        ? ' b-after'
                                                                        : ' b-after-has'
                                                                )}
                                                            >
                                                                <div
                                                                   
                                                                    className="flex gap-3 w-fit max-w-[350px] relative flex-row"
                                                                >
                                                                    <img
                                                                        src={`${
                                                                            STATIC_HOST_NO_SPLASH +
                                                                            cmt.author
                                                                                .profile_picture
                                                                        }`}
                                                                        className="rounded-full  w-[40px] h-[40px] object-cover border "
                                                                    />
                                                                    <div>
                                                                        <div className="rounded-2xl relative px-3 pt-1 pb-2 bg-slate-200 dark:bg-[#334257] ">
                                                                            <p className="font-medium text-sm">
                                                                                {
                                                                                    cmt.author
                                                                                        .full_name
                                                                                }
                                                                            </p>
                                                                            <p className="">
                                                                                {cmt.content}
                                                                            </p>
                                                                            {cmt.author.id ===
                                                                                user?.id && (
                                                                                <span
                                                                                    onClick={() => {
                                                                                        setAlertData(
                                                                                            {
                                                                                                type: 'cmt',
                                                                                                id: cmt.id,
                                                                                            }
                                                                                        );
                                                                                        setOpenAlert(
                                                                                            true
                                                                                        );
                                                                                    }}
                                                                                    className="text-gray-500 font-bold absolute -right-10 top-[50%] -translate-y-1/2 text-sm hover:underline cursor-pointer"
                                                                                >
                                                                                    Gỡ
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex relative flex-row mt-1 px-3 gap-3">
                                                                            <Tooltip>
                                                                                <TooltipTrigger
                                                                                    asChild
                                                                                >
                                                                                    <span className="text-gray-500 hover:underline  cursor-default text-[12px]">
                                                                                        {formatDistanceToNow(
                                                                                            new Date(
                                                                                                cmt.created_at
                                                                                            ),
                                                                                            {
                                                                                                locale: vi,
                                                                                            }
                                                                                        )}
                                                                                    </span>
                                                                                </TooltipTrigger>
                                                                                <TooltipContent>
                                                                                    {format(
                                                                                        new Date(
                                                                                            cmt.created_at
                                                                                        ),
                                                                                        "cccc, d 'tháng' M, yyyy 'lúc' HH:mm",
                                                                                        {
                                                                                            locale: vi,
                                                                                        }
                                                                                    )}
                                                                                </TooltipContent>
                                                                            </Tooltip>
                                                                            {cmt.likes.length >
                                                                                0 && (
                                                                                <Tooltip>
                                                                                    <TooltipTrigger
                                                                                        asChild
                                                                                    >
                                                                                        <div className="absolute flex  shadow-md cursor-default bottom-[20px] right-[-10px] z-[2] py-0.5 pr-1 rounded-xl bg-background font-semibold items-center">
                                                                                            <img
                                                                                                src="/assets/like.png"
                                                                                                className="w-[23px] h-[23px]"
                                                                                            />
                                                                                            {
                                                                                                cmt
                                                                                                    .likes
                                                                                                    .length
                                                                                            }
                                                                                        </div>
                                                                                    </TooltipTrigger>
                                                                                    <TooltipContent>
                                                                                        <>
                                                                                            {cmt.likes
                                                                                                .slice(
                                                                                                    0,
                                                                                                    10
                                                                                                )
                                                                                                .map(
                                                                                                    (
                                                                                                        lk: any,
                                                                                                        index: number
                                                                                                    ) => (
                                                                                                        <p
                                                                                                            key={
                                                                                                                lk.id
                                                                                                            }
                                                                                                        >
                                                                                                            {index !==
                                                                                                            9
                                                                                                                ? convertUser(
                                                                                                                      lk
                                                                                                                          .user
                                                                                                                          .id,
                                                                                                                      lk
                                                                                                                          .user
                                                                                                                          .full_name,
                                                                                                                      user
                                                                                                                  )
                                                                                                                : '...'}
                                                                                                        </p>
                                                                                                    )
                                                                                                )}
                                                                                        </>
                                                                                    </TooltipContent>
                                                                                </Tooltip>
                                                                            )}
                                                                            {cmt.likes.findIndex(
                                                                                (lk: any) =>
                                                                                    lk.user.id ===
                                                                                    user?.id
                                                                            ) !== -1 ? (
                                                                                <span
                                                                                    onClick={() =>
                                                                                        handleLikeComment(
                                                                                            cmt.id
                                                                                        )
                                                                                    }
                                                                                    className="text-[blue] cursor-pointer hover:underline font-bold text-[12px]"
                                                                                >
                                                                                    Bỏ thích
                                                                                </span>
                                                                            ) : (
                                                                                <span
                                                                                    onClick={() =>
                                                                                        handleLikeComment(
                                                                                            cmt.id
                                                                                        )
                                                                                    }
                                                                                    className="text-gray-500 cursor-pointer hover:underline font-bold text-[12px]"
                                                                                >
                                                                                    Thích
                                                                                </span>
                                                                            )}

                                                                            <span
                                                                                onClick={() => {
                                                                                    setRepOpen(
                                                                                        cmt.id
                                                                                    );
                                                                                    setValueRep(
                                                                                        '@' +
                                                                                            cmt
                                                                                                .author
                                                                                                .full_name +
                                                                                            ' '
                                                                                    );
                                                                                }}
                                                                                className="text-gray-500 cursor-pointer hover:underline font-bold  text-[12px]"
                                                                            >
                                                                                Trả lời
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                {item.comments
                                                                    .filter(
                                                                        (re) => re.rep === cmt.id
                                                                    )
                                                                    .map((data) => (
                                                                        <div className="chat c-after">
                                                                            <div
                                                                                key={data.id}
                                                                                className="flex gap-3 w-fit max-w-[350px] relative flex-row"
                                                                            >
                                                                                <img
                                                                                    src={`${
                                                                                        STATIC_HOST_NO_SPLASH +
                                                                                        data.author
                                                                                            .profile_picture
                                                                                    }`}
                                                                                    className="rounded-full  w-[40px] h-[40px] object-cover border "
                                                                                />
                                                                                <div>
                                                                                    <div className="rounded-2xl relative px-3 pt-1 pb-2 bg-slate-200 dark:bg-[#334257]">
                                                                                        <p className="font-medium text-sm">
                                                                                            {
                                                                                                data
                                                                                                    .author
                                                                                                    .full_name
                                                                                            }
                                                                                        </p>
                                                                                        <p className="">
                                                                                            {
                                                                                                data.content
                                                                                            }
                                                                                        </p>
                                                                                        {data.author
                                                                                            .id ===
                                                                                            user?.id && (
                                                                                            <span
                                                                                            onClick={() => {
                                                                                                setAlertData(
                                                                                                    {
                                                                                                        type: 'cmt',
                                                                                                        id: data.id,
                                                                                                    }
                                                                                                );
                                                                                                setOpenAlert(
                                                                                                    true
                                                                                                );
                                                                                            }}
                                                                                                className="text-gray-500 font-bold absolute -right-10 top-[50%] -translate-y-1/2 text-sm hover:underline cursor-pointer"
                                                                                            >
                                                                                                Gỡ
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="flex relative flex-row mt-1 px-3 gap-3">
                                                                                        <Tooltip>
                                                                                            <TooltipTrigger
                                                                                                asChild
                                                                                            >
                                                                                                <span className="text-gray-500 hover:underline  cursor-default text-[12px]">
                                                                                                    {formatDistanceToNow(
                                                                                                        new Date(
                                                                                                            data.created_at
                                                                                                        ),
                                                                                                        {
                                                                                                            locale: vi,
                                                                                                        }
                                                                                                    )}
                                                                                                </span>
                                                                                            </TooltipTrigger>
                                                                                            <TooltipContent>
                                                                                                {format(
                                                                                                    new Date(
                                                                                                        data.created_at
                                                                                                    ),
                                                                                                    "cccc, d 'tháng' M, yyyy 'lúc' HH:mm",
                                                                                                    {
                                                                                                        locale: vi,
                                                                                                    }
                                                                                                )}
                                                                                            </TooltipContent>
                                                                                        </Tooltip>
                                                                                        {data.likes
                                                                                            .length >
                                                                                            0 && (
                                                                                            <Tooltip>
                                                                                                <TooltipTrigger
                                                                                                    asChild
                                                                                                >
                                                                                                    <div className="absolute flex  shadow-md cursor-default bottom-[5px] right-[-15px] dark:border z-[2] py-0.5 pr-1 rounded-xl bg-background font-semibold items-center">
                                                                                                        <img
                                                                                                            src="/assets/like.png"
                                                                                                            className="w-[20px] h-[20px]"
                                                                                                        />
                                                                                                        {
                                                                                                            data
                                                                                                                .likes
                                                                                                                .length
                                                                                                        }
                                                                                                    </div>
                                                                                                </TooltipTrigger>
                                                                                                <TooltipContent>
                                                                                                    <>
                                                                                                        {data.likes
                                                                                                            .slice(
                                                                                                                0,
                                                                                                                10
                                                                                                            )
                                                                                                            .map(
                                                                                                                (
                                                                                                                    lk: any,
                                                                                                                    index: number
                                                                                                                ) => (
                                                                                                                    <p
                                                                                                                        key={
                                                                                                                            lk.id
                                                                                                                        }
                                                                                                                    >
                                                                                                                        {index !==
                                                                                                                        9
                                                                                                                            ? convertUser(
                                                                                                                                  lk
                                                                                                                                      .user
                                                                                                                                      .id,
                                                                                                                                  lk
                                                                                                                                      .user
                                                                                                                                      .full_name,
                                                                                                                                  user
                                                                                                                              )
                                                                                                                            : '...'}
                                                                                                                    </p>
                                                                                                                )
                                                                                                            )}
                                                                                                    </>
                                                                                                </TooltipContent>
                                                                                            </Tooltip>
                                                                                        )}
                                                                                        {data.likes.findIndex(
                                                                                            (
                                                                                                lk: any
                                                                                            ) =>
                                                                                                lk
                                                                                                    .user
                                                                                                    .id ===
                                                                                                user?.id
                                                                                        ) !== -1 ? (
                                                                                            <span
                                                                                                onClick={() =>
                                                                                                    handleLikeComment(
                                                                                                        data.id
                                                                                                    )
                                                                                                }
                                                                                                className="text-[blue] cursor-pointer hover:underline font-bold text-[12px]"
                                                                                            >
                                                                                                Bỏ
                                                                                                thích
                                                                                            </span>
                                                                                        ) : (
                                                                                            <span
                                                                                                onClick={() =>
                                                                                                    handleLikeComment(
                                                                                                        data.id
                                                                                                    )
                                                                                                }
                                                                                                className="text-gray-500 cursor-pointer hover:underline font-bold text-[12px]"
                                                                                            >
                                                                                                Thích
                                                                                            </span>
                                                                                        )}

                                                                                        <span
                                                                                            onClick={() => {
                                                                                                setRepOpen(
                                                                                                    cmt.id
                                                                                                );
                                                                                                setValueRep(
                                                                                                    '@' +
                                                                                                        data
                                                                                                            .author
                                                                                                            .full_name +
                                                                                                        ' '
                                                                                                );
                                                                                            }}
                                                                                            className="text-gray-500 cursor-pointer hover:underline font-bold  text-[12px]"
                                                                                        >
                                                                                            Trả lời
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                {repOpen === cmt.id && (
                                                                    <div className="flex chat-box c-after-box gap-3 pt-[10px] bg-background items-center w-full  max-w-[400px]">
                                                                        <img
                                                                            src={`${
                                                                                STATIC_HOST_NO_SPLASH +
                                                                                user?.profile_picture
                                                                            }`}
                                                                            className="rounded-full  w-[40px] h-[40px] object-cover border "
                                                                        />
                                                                        <Input
                                                                            autoFocus={true}
                                                                            value={valueRep}
                                                                            onChange={
                                                                                handleRepChange
                                                                            }
                                                                            spellCheck={false}
                                                                            onKeyDown={(e) =>
                                                                                handleKeyDownRep(
                                                                                    e,
                                                                                    cmt,
                                                                                    item.id
                                                                                )
                                                                            }
                                                                            type="text"
                                                                            placeholder="Trả lời bình luận...."
                                                                            className="bg-slate-200 dark:bg-[#334257]  h-9 flex-1  rounded-3xl placeholder:text-gray-500 pl-4 pr-3"
                                                                        />
                                                                        {loadingCmt ?<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />: <Send onClick={()=>handleRepSubmit({ comment: valueRep, rep_id: cmt.id, post_id: item.id })} className='cursor-pointer' />}
                                                                       
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </div>

                                            <div
                                                className=" h-[1px] bg-gray-300 absolute bottom-[50px] -translate-x-[16px]"
                                                style={{ width: 'calc(100% + 32px)' }}
                                            ></div>
                                        </div>
                                    )}

                                    <div className="flex gap-3 pt-[10px] bg-background items-center w-full ">
                                        <img
                                            src={`${STATIC_HOST_NO_SPLASH + user?.profile_picture}`}
                                            className="rounded-full  w-[40px] h-[40px] object-cover border "
                                        />
                                        <Input
                                            value={valueComment}
                                            onChange={handleCommentChange}
                                            onKeyDown={(e) => handleKeyDown(e, item)}
                                            type="text"
                                            placeholder="Nhập bình luận về bài viết..."
                                            className="bg-slate-200 dark:bg-[#334257] h-9 flex-1  rounded-3xl placeholder:text-gray-500 pl-4 pr-3"
                                        />
                                        {loadingCmt ?<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />: <Send onClick={()=>handleCommentSubmit({ comment: valueComment, post_id: item.id })} className='cursor-pointer' />}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                {width > 1200 && (
                    <div className="col-span-1">
                        <div className="bg-background rounded-md pb-5 shadow-md overflow-hidden relative">
                            <div className="w-full h-[50px] dark:text-gray-300 flex items-center px-3 text-lg font-medium text-gray-600 border-b ">
                                Gợi ý kết bạn
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn cóa chăc chẵn muốn gỡ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động xóa này sẽ vĩnh viễn xóa đi và không thể khôi phục
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={() => navDel()}>Xóa</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
