import axios,{AxiosResponse} from "axios";
import {timeout} from '@/api/config'
const baseURL = process.env.NEXT_PUBLIC_API_URL;
const apiURL = '/api/tags';

//取得所有tags
interface TagsResponse{
    //成功=>message&tags，失敗=>message&error
    message : string;
    tags?:string[];
    error?: string;
}

//取得所有tag
async function GET(): Promise<TagsResponse> {
    try {
        const response: AxiosResponse<TagsResponse> = await axios({
            method: 'get',
            url: apiURL,
            baseURL: baseURL,
            timeout:timeout,
        });
        return response.data;
    } catch (error : any) {
        if (axios.isAxiosError(error) && error.response) {
            const getError = error.response.data
            //return backend's error response body
            console.log(getError.error,":",getError.message)
            return getError as TagsResponse;
        }else{
            //非後端error
            console.log("An unexpected error occurred",":",error.message)
            return {
                message: "An unexpected error occurred",
                error: error.message
            }as TagsResponse;
        }
    }
}

const tags = { GET }
export default tags;