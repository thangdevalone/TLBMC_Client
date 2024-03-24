import axiosClient from './axiosClient';

const courseApi = {  
    getCourse(){
        const url=`courses/`
        return axiosClient.get(url)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    postCourse(data:any){
        const url=`courses/`
        return axiosClient.post(url,data)
    },
    delCourse(id:number){
        const url=`courses/${id}`
        return axiosClient.delete(url)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    patchCourse(id:number,data:any){
        const url=`courses/${id}`
        return axiosClient.post(url,data)
    },
    saveCourse(id:number){
        const url=`course-save/`
        return axiosClient.post(url,{course_id:id})
    },
    getCourseSave(){
        const url=`course-save/`
        return axiosClient.get(url)
    }
};
export default courseApi;
