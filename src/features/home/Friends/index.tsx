/* eslint-disable @typescript-eslint/no-explicit-any */
import friendApi from '@/api/friendApi';
import { Button } from '@/components/ui/button';
import { STATIC_HOST_NO_SPLASH } from '@/constants';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

export const Friends = () => {
    const [friendRequests, setFriendRequests] = useState<any[]>([]);
    const [friendSuggestions, setFriendSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [reqResponse, sugResponse] = await Promise.all([
                    friendApi.reqFriends(),
                    friendApi.sugFriends(),
                ]);
                setFriendRequests(reqResponse as unknown as any[]);
                setFriendSuggestions(sugResponse as unknown as any[]);
                setLoading(false);
                console.log(reqResponse, sugResponse);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    const handleFriend = async (id: number, idx: number) => {
        try {
            await friendApi.sendFriend(id);
            const newFriendSug = friendSuggestions;
            newFriendSug[idx].sended = true;
            setFriendRequests(newFriendSug);
        } catch (error) {
            console.log(error);
        }
    };
    const handleAccept = async (id: number, idx: number) => {
        try {
            await friendApi.acceptFriend(id);
            const newFriendReq = friendRequests;
            newFriendReq[idx].accept = true;
            setFriendRequests(newFriendReq);
        } catch (error) {
            console.log(error);
        }
    };
    const handleDel = async (id: number) => {
        try {
            await friendApi.delFriend(id);
            const newFriendReq = friendRequests.filter((item) => (item.id = id));
            setFriendRequests(newFriendReq);
        } catch (error) {
            console.log(error);
        }
    };
    if (loading) {
        const placeholders = Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="w-[200px] h-[300px]   bg-background rounded-xl shadow">
                <div className="flex items-center justify-center h-[150px] bg-gray-300 bg-background rounded ">
                    <svg
                        className="w-10 h-10 text-gray-200 dark:text-gray-600"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 20"
                    >
                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                    </svg>
                </div>
                <div className="p-2">
                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full mb-4"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                </div>
            </div>
        ));

        return (
            <div className="container mt-4 ">
                <p className="text-xl font-medium mb-3">Lời mời kết bạn</p>
                <div className="animate-pulse flex justify-around flex-row gap-4">
                    {placeholders}
                </div>
                <hr className="border-gray-300 border-1 block my-4" />
                <p className="text-xl font-medium mb-3">Kết bạn bốn phương</p>
                <div className="animate-pulse flex  justify-around flex-row gap-4">
                    {placeholders}
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4 ">
            <p className="text-xl font-medium mb-3">Lời mời kết bạn</p>
            <div
                className={cn(
                    'flex flex-row gap-4',
                    friendSuggestions?.length >= 5 ? ' justify-around' : ''
                )}
            >
                {friendRequests?.length > 0
                    ? friendRequests.map((item: any, idx: number) => (
                          <div
                              key={item.id}
                              className="w-[200px]  border border-gray-400 overflow-hidden  bg-background rounded-xl shadow"
                          >
                              <img
                                  src={`${STATIC_HOST_NO_SPLASH + item.from_user.profile_picture}`}
                                  className=" h-[200px] w-full object-cover border-b  border-gray-400"
                              />
                              <div className="p-2 flex flex-col  justify-between">
                                  <div>
                                      <p className="text-center font-medium text-lg">
                                          {item.from_user.full_name}
                                      </p>
                                      <p className="text-center text-slate-500 text-sm">
                                          {item.from_user.education}
                                      </p>
                                  </div>
                                  <div>
                                      <Button
                                          size="sm"
                                          onClick={() => handleAccept(item.id, idx)}
                                          className="mt-2 w-full"
                                          disabled={Boolean(item?.accept)}
                                      >
                                          {item?.accept ? (
                                              <>
                                                  <Check className="mr-2" /> Bạn bè
                                              </>
                                          ) : (
                                              'Xác nhận'
                                          )}
                                      </Button>
                                      <Button
                                          onClick={() => handleDel(item.id)}
                                          className="mt-2 w-full"
                                          variant="outline"
                                          size="sm"
                                      >
                                          Từ chối
                                      </Button>
                                  </div>
                              </div>
                          </div>
                      ))
                    : 'Chưa có lời mời kết bạn nào'}
            </div>
            <hr className="border-gray-300 border-1 block my-4" />
            <p className="text-xl font-medium mb-3">Kết bạn bốn phương</p>
            <div
                className={cn(
                    'flex flex-row gap-4',
                    friendSuggestions?.length >= 5 ? ' justify-around' : ''
                )}
            >
                {friendSuggestions?.length > 0
                    ? friendSuggestions.map((item: any, idx: number) => (
                          <div
                              key={item.id}
                              className="w-[200px]  border border-gray-400 overflow-hidden  bg-background rounded-xl shadow"
                          >
                              <img
                                  src={`${STATIC_HOST_NO_SPLASH + item.profile_picture}`}
                                  className=" h-[200px] w-full object-cover border-b  border-gray-400"
                              />
                              <div className="p-2 flex flex-col justify-between">
                                  <div>
                                      <p className="text-center font-medium text-lg">
                                          {item.full_name}
                                      </p>
                                      <p className="text-center text-slate-500 text-sm">
                                          {item.education}
                                      </p>
                                  </div>
                                  <Button
                                      onClick={() => handleFriend(item.id, idx)}
                                      className="mt-2 w-full"
                                      disabled={Boolean(item?.sended)}
                                      size="sm"
                                  >
                                      {item?.sended ? (
                                          <>
                                              <Check className="mr-2" /> Đã gửi lời mời
                                          </>
                                      ) : (
                                          'Thêm bạn bè'
                                      )}
                                  </Button>
                              </div>
                          </div>
                      ))
                    : 'Không có sẵn'}
            </div>
        </div>
    );
};
