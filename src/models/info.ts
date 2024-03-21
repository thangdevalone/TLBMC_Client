/* eslint-disable @typescript-eslint/no-explicit-any */
export interface InfoUser {
    id: number;
    last_login: any;
    is_superuser: boolean;
    email: string;
    profile_picture: string;
    full_name: string;
    date_of_birth: string;
    phone_number: string;
    address: string;
    facebook: any;
    instagram: any;
    linkedin: any;
    education: string;
    work_experience: string;
    skills: string;
    activities: any;
    certificates: any;
    awards: any;
    groups: any[];
    user_permissions: any[];
    related_images: ImageDel[];
}
export interface ImageDel{
    id:number
    user:number
    pos:number
    image:string
}
export interface InfoPost {
    id: number;
    author: Author;
    content: string;
    created_at: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    comments: any[];
    global_post:boolean
    likes:any[];
}

export interface Author {
    id: number;
    full_name: string;
    education: string;
    profile_picture: string;
}
