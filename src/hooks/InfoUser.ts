import { useAppSelector } from '@/app/hooks';
import { InfoUser } from '@/models';

export const useInfoUser = (): InfoUser | undefined => {
    const user = useAppSelector((state) => state.auth.currentUser);
    return user;
};
