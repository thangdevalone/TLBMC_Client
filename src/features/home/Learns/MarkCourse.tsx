import courseApi from '@/api/courseApi';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { STATIC_HOST_NO_SPLASH } from '@/constants';
import { useInfoUser } from '@/hooks';
import { InfoCourse } from '@/models';
import { format, formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Bookmark } from 'lucide-react';
import { useEffect, useState } from 'react';

export const MarkCourse=()=>{
    const [course, setCourse] = useState<InfoCourse[]>();
    const [data, setData] = useState<InfoCourse>();
    const fetchData = async () => {
        const res = await courseApi.getCourseSave()  as unknown as InfoCourse[];
        if(data){
            if (res.length===0 ||res.findIndex((item)=>item.id===data.id)===-1){
                setData(undefined);
                setOpenCourse(false);
            }
            res.forEach((item)=>{
                if(item.id===data.id){
                    setData(item)
                }
            })
            
        }
        setCourse(res);
    };
    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const {toast}=useToast()
    const [openCourse, setOpenCourse] = useState(false);
    const saver = (id: number,status:string) => {
        (async () => {
            await courseApi.saveCourse(id);
            fetchData();
            if(status==='s'){
                toast({
                    title:"Lưu thành công",
                })
            }
              if(status==='b'){
                toast({
                    title:"Bỏ lưu thành công",
                  
                })
                
            }
        })();
    };
    const user = useInfoUser();
    return (<div className=" h-full mb-5 grid md:gap-5 sm:gap-2 xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
    <Dialog open={openCourse} onOpenChange={setOpenCourse}>
        {course && course?.length > 0
            ? course.map((item) => (
                  <DialogTrigger
                      key={item.id}
                      onClick={() => {
                          setOpenCourse(true);
                          setData(item);
                      }}
                      asChild
                  >
                      <div>
                          <div
                              className="shadow-md cursor-pointer overflow-hidden rounded-xl"
                              style={{
                                  boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                              }}
                          >
                              <img
                                  className="h-[150px] object-cover"
                                  src={`${STATIC_HOST_NO_SPLASH + item.image}`}
                                  alt="anh"
                              />
                              <div className="px-2 pt-1 pb-2">
                                  <p className="text-[16px] hover:underline font-medium">
                                      {item.title}
                                  </p>
                                  <p className=" text-[13px] text-gray-500 line-clamp-1">
                                      Mô tả: {item.title}
                                  </p>

                                  <div className="flex mt-2 flex-row justify-between">
                                      <span className="text-[12px] text-slate-500">
                                          {formatDistanceToNow(new Date(item.created_at), {
                                              locale: vi,
                                          })}
                                      </span>
                                      <span className="text-[12px] text-slate-500">
                                          {item.saver.length} đã lưu
                                      </span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </DialogTrigger>
              ))
            : 'Chưa có khóa học nào'}
        {data && (
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Khóa học: {data.title}</DialogTitle>
                    <DialogDescription>{data.description}</DialogDescription>
                    <p>
                        <b>Khóa học được tạo:</b>{' '}
                        {format(data.created_at, 'dd/MM/yyyy hh:mm')}
                    </p>
                    <p>
                        <b>Tạo bởi:</b> {data.created_by.full_name} -{' '}
                        {data.created_by.education}
                    </p>
                    <p>
                        <b>Ảnh xem trước:</b>
                    </p>
                    <img
                        className="w-[300px] object-cover"
                        src={`${STATIC_HOST_NO_SPLASH + data.image}`}
                        alt="anh"
                    />
                    <DialogFooter className="!mt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Đóng
                            </Button>
                        </DialogClose>

                        {data.saver.findIndex((item) => item.user.id === user?.id) !==
                        -1 ? (
                            <Button
                                onClick={() => saver(data.id,'b')}
                                type="button"
                                variant="secondary"
                            >
                                <Bookmark fill='white' className="mr-2" /> Bỏ lưu
                            </Button>
                        ) : (
                            <Button
                                onClick={() => saver(data.id,'s')}
                                type="button"
                                variant="secondary"
                            >
                                <Bookmark className="mr-2" /> lưu
                            </Button>
                        )}

                        <Button
                            onClick={() => window.open(data.link, '_blank')}
                            autoFocus
                            type="button"
                            variant="default"
                        >
                            Xem khóa học
                        </Button>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        )}
    </Dialog>
</div>)
}