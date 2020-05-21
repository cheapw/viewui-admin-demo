import HttpRequest from '@/libs/axios'
import config from '@/config'
const authBaseUrl = process.env.NODE_ENV === 'development' ? config.authBaseUrl.dev : config.authBaseUrl.pro

const axiosAuth = new HttpRequest(authBaseUrl)
export default axiosAuth
