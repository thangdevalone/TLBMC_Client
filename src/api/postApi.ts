import { PostForm } from '@/models';
import axiosClient from './axiosClient';

const postApi = {
    getNew(){
        const url='posts/'
        return axiosClient.get(url)
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
