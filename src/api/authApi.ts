import { ChangePass, LoginForm } from '@/models';
import axiosClient from './axiosClient';
import { NewPassForm } from '@/features/NewPass';

const authApi = {
    login(data: LoginForm) {
        const url = 'login/';
        return axiosClient.post(url, data);
    },
    hello() {
        const url = 'auth/hello';
        return axiosClient.get(url);
    },
    register(otp:string){
        const url='register/'
        return axiosClient.post(url,otp)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendOtp(data:any){
        const url='send-otp/'
        return axiosClient.post(url,data)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateInfo(data:any){
        const url='update-profile/'
        return axiosClient.patch(url,data)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    uploadRelated(data:any){
        const url='create_related_image/'
        return axiosClient.post(url,data)
    },
    changePass(id:number,data:ChangePass){
        const postData={
            current_password:data.current_password,
            new_password:data.new_password
        }
        const url = `account/change-password/${id}`;
        return axiosClient.post(url,postData);
    },
    forgotPass(gmail:string){
        const url='forgot/forgot-password'
        return axiosClient.post(url,{email:gmail})
    },
    resetPass(token:string,data:NewPassForm){
        const url=`forgot/reset-password/${token}`
        return axiosClient.post(url,data)
    }
};
export default authApi;
