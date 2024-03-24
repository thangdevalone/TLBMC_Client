import axiosClient from './axiosClient';

const friendApi = {
    reqFriends(){
        const url=`friendship-requests/`
        return axiosClient.get(url)
    },
    sendFriend(id:number){
        const url=`friendship-requests/`
        return axiosClient.post(url,{friend_id:id})
    },
    acceptFriend(id:number){
        const url=`friendship-requests/`
        return axiosClient.put(url,{from_id:id,status:"accepted"})
    },
    delFriend(id:number){
        const url=`friendship-requests/`
        return axiosClient.put(url,{from_id:id,status:"cancelled"})
    },
    sugFriends(){
        const url=`friend-suggestions/`
        return axiosClient.get(url)
    }
};
export default friendApi;
