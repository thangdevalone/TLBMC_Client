import { PostForm } from '@/models';
import axiosClient from './axiosClient';

const postApi = {
    getNew(){
        const url='posts/'
        return axiosClient.get(url)
    },
    delNew(id:number){
        const url=`posts/${id}`
        return axiosClient.delete(url)
    },
    delCom(id:number){
        const url=`comments/${id}`
        return axiosClient.delete(url)
    },
    postNew(data:PostForm){
        const url='posts/'
        return axiosClient.post(url,data)
    },
    likeNew(idPost:number){
        const url=`posts/${idPost}/like/`
        return axiosClient.post(url)
    },
    likeComment(idComment:number){
        const url=`comments/${idComment}/like/`
        return axiosClient.post(url)
    }
};
export default postApi;
