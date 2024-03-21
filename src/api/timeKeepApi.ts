import { QueryParam } from '@/models';
import { ConvertQueryParam } from '@/utils';
import axiosClient from './axiosClient';

const timeKeepApi = {
    getListTimeKeepAll(param?: QueryParam) {
        const url = `timesheet/list-timesheet${ConvertQueryParam(param)}`;
        return axiosClient.get(url);
    },
    getListTimeKeepAllRaw(param?: QueryParam) {
        const url = `timesheet/list-timesheet-raw${ConvertQueryParam(param)}`;
        return axiosClient.get(url);
    },
    getListTimeKeep(param?: QueryParam) {
        const url = `timesheet/list-timesheet-staff${ConvertQueryParam(param)}`;
        return axiosClient.get(url);
    },
    checkin(){
        const url='timesheet/check-in';
        return axiosClient.post(url);
    },
    checkout(){
        const url='timesheet/check-out';
        return axiosClient.post(url);
    }
 
};
export default timeKeepApi;
