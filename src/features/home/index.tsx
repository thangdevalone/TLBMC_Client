

import { NavHeader } from '@/components/NavHeader';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Outlet } from 'react-router-dom';

export default function Home() {

    return (
        <div className="flex-col h-full flex">
            {/* <div className="fixed right-[20px] top-[20px]">
                <ModeToggle />
            </div> */}
            <NavHeader/>
            <div className="flex-1  flex flex-col bg-[#fcf0ff] dark:bg-[#18191A]" >
                <ScrollArea style={{height:"calc(100vh - 65px)"}}>
                <Outlet />
                </ScrollArea>
            </div>
        </div>
    );
}
