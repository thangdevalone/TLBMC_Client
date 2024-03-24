import { useInfoUser } from "@/hooks";
import { InfoUser } from "@/models";
class Permission {
    user: InfoUser;
    constructor(user:InfoUser) {
        this.user = user;
    }


    get IS_ADMIN() {
        return this.user.is_superuser;
    }
}

// Sử dụng hook trong functional component
export const PermissionProvider = () => {
    const user = useInfoUser();
    if(user){
        return new Permission(user);
    }
    return null;
}