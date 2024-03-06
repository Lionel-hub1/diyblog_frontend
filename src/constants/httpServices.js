import axios from 'axios';
import apiUrl from './apiUrl';

const basicConf = axios.create({
    baseURL: apiUrl,
});

export default {
    get: basicConf.get,
    post: basicConf.post,
    put: basicConf.put,
    delete: basicConf.delete,
}