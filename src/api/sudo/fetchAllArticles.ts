import axios,{AxiosResponse} from "axios";
import {timeout} from '@/api/config'
const baseURL = process.env.NEXT_PUBLIC_API_URL;
const apiURL = '/api/sudo/articles'

//獲取article的所有data
interface Data {
    uuid : string;
    title: string;
    content: string;
    cover_image_url : string | null;
    tags: string | null;
    is_published: boolean;
    creation_date: string;
    modification_date: string | null;
}

//獲取文章的資料
interface ArticlesResponse {
    //成功=>message&data，失敗=>message&error
    message: string;
    data?: Data[];
    error? :string;
}

//查詢所有文章
async function GET(): Promise<ArticlesResponse> {
    try {
        const response: AxiosResponse<ArticlesResponse> = await axios({
            method: 'get',
            url: apiURL,
            baseURL: baseURL,
            timeout: timeout,
        });
        return response.data;
    } catch (error : any) {
        if (axios.isAxiosError(error) && error.response) {
            const getError = error.response.data
            //return backend's error response body
            console.log(getError.error,":",getError.message)
            return getError as ArticlesResponse;
        }else{
            //非後端error
            console.log("An unexpected error occurred",":",error.message)
            return {
                message: "An unexpected error occurred",
                error: error.message
            }as ArticlesResponse;
        }
    }
}

//創建文章
async function POST(): Promise<ArticlesResponse> {
    try{
        const response: AxiosResponse<ArticlesResponse> = await axios({
            method: 'post',
            url: apiURL,
            baseURL: baseURL,
            timeout: timeout,
            data: {} //傳遞payload{}
        });
        return response.data;
    }catch(error : any){
        if (axios.isAxiosError(error) && error.response) {
            const getError = error.response.data
            //return backend's error response body
            console.log(getError.error,":",getError.message)
            return getError as ArticlesResponse;
        }else{
            //非後端error
            console.log("An unexpected error occurred",":",error.message)
            return {
                message: "An unexpected error occurred",
                error: error.message
            }as ArticlesResponse;
        }
    }
    
}


const fetchAllArticles = { GET, POST }
export default fetchAllArticles