import axios,{AxiosResponse} from "axios";
import {timeout} from '@/api/config'
const baseURL = process.env.NEXT_PUBLIC_API_URL;
const apiURL = '/api/articles'

//獲取article的所有data
interface Data {
    uuid: string;
    title: string;
    content: string;
    cover_image_url: string | null;
    tags: string;
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

//取得特定tag之已發布文章
async function GET(tag_name: string): Promise<ArticlesResponse> {
    try{
        const response :AxiosResponse<ArticlesResponse>= await axios({
            method: 'get',
            url: `${apiURL}/${tag_name}`,
            baseURL: baseURL,
            timeout:timeout,
        });
        return response.data;
    }catch(error : any){
        if (axios.isAxiosError(error) && error.response) {
            const getError = error.response.data
            //return backend's error response body
            console.log(getError.error,":",getError.message)
            return error.response.data as ArticlesResponse
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


const tagsArticles = { GET };
export default tagsArticles;