export interface PostForm {
    content: string;
    global_post: boolean;
}
export interface UserUpdateForm {
    email: string;// Điều chỉnh kiểu dữ liệu nếu cần
    full_name: string;
    date_of_birth: string; // Hoặc kiểu dữ liệu phù hợp cho ngày tháng
    phone_number: string;
    address?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    education: string; // Điều chỉnh kiểu dữ liệu nếu cần
    work_experience: string; // Điều chỉnh kiểu dữ liệu nếu cần
    skills?: string; // Điều chỉnh kiểu dữ liệu nếu cần
    activities?: string; // Điều chỉnh kiểu dữ liệu nếu cần
    certificates?: string; // Điều chỉnh kiểu dữ liệu nếu cần
    awards?: string; // Điều chỉnh kiểu dữ liệu nếu cần
}
