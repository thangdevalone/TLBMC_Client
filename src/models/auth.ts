import { InfoUser } from "./info";

export interface LoginForm {
    email: string;
    password: string;
}
export interface RegisterForm_1 {
    full_name: string;
    date_of_birth:string;
    address:string;
    education:string;
    work_experience:string;
    skills?:string;
    phone_number:string;
}
export interface RegisterForm_2 {
    email: string;
    password: string;
    re_pass:string;
}
export interface AuthRes {
    data: InfoUser;
    tokens: Token;
}

export interface Token {
    refresh: string;
    access: string;
}
