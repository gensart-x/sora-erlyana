import axios, { AxiosInstance } from 'axios';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';

const cookieJar = new CookieJar();

const axiosWithCookieJarInstance: AxiosInstance = wrapper(axios.create({
    jar: cookieJar
}));

export default axiosWithCookieJarInstance;