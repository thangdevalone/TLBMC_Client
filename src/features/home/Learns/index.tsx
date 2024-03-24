import { useAppSelector } from '@/app/hooks';
import { buttonVariants } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { PermissionProvider } from '@/utils';
import { BookMarked, Group, Layers3 } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const sidebarNavItems = [
    {
        title: 'Khóa học có sẵn',
        href: '/home/learns/course',
        icon: <Layers3 />,
    },
    {
        title: 'Khóa học đã lưu',
        href: '/home/learns/save',
        icon: <BookMarked />,
    },
];
const sidebarAdminNavItems = [
    {
        title: 'Quản trị khóa học',
        href: '/home/learns/admin',
        icon: <Group />,
    },
    {
        title: 'Khóa học có sẵn',
        href: '/home/learns/course',
        icon: <Layers3 />,
    },
    {
        title: 'Khóa học đã lưu',
        href: '/home/learns/save',
        icon: <BookMarked />,
    },
];
export const Learns = () => {
    const { pathname } = useLocation();
    const P = PermissionProvider();
    const { width } = useAppSelector((state) => state.app);
    return (
        <div
            className={cn(
                'bg-background  py-[20px] container',
                width > 1400 ? 'rounded-lg mt-[25px]' : ''
            )}
            style={{
                height: width > 1400 ? 'calc(100vh - 125px)' : 'calc(100vh - 65px)',
                boxShadow:
                    width > 1400
                        ? 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px'
                        : 'none',
            }}
        >
            <div className="flex w-full h-full flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className=" lg:w-1/5">
                    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                        {P?.IS_ADMIN
                            ? sidebarAdminNavItems.map((item) => (
                                  <Link
                                      key={item.href}
                                      to={item.href}
                                      className={cn(
                                          buttonVariants({ variant: 'ghost' }),
                                          pathname === item.href
                                              ? 'bg-slate-200 hover:bg-slate-200 dark:bg-[#334257] dark:hover:bg-[#334257] '
                                              : 'hover:bg-slate-200 dark:hover:bg-[#334257]',
                                          'justify-start',
                                          'gap-2 h-10'
                                      )}
                                  >
                                      {item.icon}
                                      {item.title}
                                  </Link>
                              ))
                            : sidebarNavItems.map((item) => (
                                  <Link
                                      key={item.href}
                                      to={item.href}
                                      className={cn(
                                          buttonVariants({ variant: 'ghost' }),
                                          pathname === item.href
                                              ? 'bg-muted hover:bg-muted'
                                              : 'hover:bg-muted',
                                          'justify-start',
                                          'gap-2 h-10'
                                      )}
                                  >
                                      {item.icon}
                                      {item.title}
                                  </Link>
                              ))}
                    </nav>
                </aside>
                <div className="flex-1 ">
                    <ScrollArea
                        style={{
                            height: width > 1400 ? 'calc(100vh - 165px)' : 'calc(100vh - 105px)',
                        }}
                        className='pr-5'
                    >
                        <Outlet />
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
};
