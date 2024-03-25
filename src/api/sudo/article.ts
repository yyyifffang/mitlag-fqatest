import axios, { AxiosResponse } from 'axios'
import { timeout } from "@/api/config"
const baseURL = process.env.NEXT_PUBLIC_API_URL
const apiURL = "/api/sudo/article"

//獲取article的所有data
interface Data {
  uuid: string;
  title: string;
  content: string;
  cover_image_url: string | null;
  tags: string | null;
  is_published: boolean;
  creation_date: string;
  modification_date: string | null;
}
//獲取文章的資料
interface ArticleResponse {
  //成功=>message&data，失敗=>message&error
  message: string;
  data?: Data;
  error? :string;
}

//刪除特定文章
interface DeleteResponse {
  //成功=>message&uuid，失敗=>message&error
  message: string;
  uuid?: string;
  error?: string;
}

async function GET(uuid: string): Promise<ArticleResponse> {
  try {
    const response: AxiosResponse<ArticleResponse> = await axios({
      method: 'get',
      url: apiURL + "/" + uuid,
      baseURL: baseURL,
      timeout: timeout
    })
    return response.data;
  } catch (error: any) {
    const responseData = (axios.isAxiosError(error) && error.response)
      ? error.response.data
      : {
        error: "An unexpected error occurred",
        message: error.message
      }
    console.log(responseData.error, ':', responseData.message)
    return responseData as ArticleResponse
  }
}

async function PUT(uuid: string, body: Data): Promise<ArticleResponse> {
  try {
    const response: AxiosResponse<ArticleResponse> = await axios({
      method: 'put',
      data: body,
      url: apiURL + "/" + uuid,
      baseURL: baseURL,
      timeout: timeout
    })
    return response.data;
  } catch (error: any) {
    const responseData = (axios.isAxiosError(error) && error.response)
      ? error.response.data
      : {
        error: "An unexpected error occurred",
        message: error.message
      }
    console.log(responseData.error, ':', responseData.message)
    return responseData as ArticleResponse
  }
}

//使用uuid刪除特定文章
async function DELETE(uuid: string): Promise<DeleteResponse> {
  try {
      const response :AxiosResponse<DeleteResponse>= await axios({
          method: 'delete',
          url: `${apiURL}/${uuid}`,
          baseURL: baseURL,
          timeout: timeout,
      });
      return response.data;
  } catch (error : any) {
    if (axios.isAxiosError(error) && error.response) {
        const getError = error.response.data
        //return backend's error response body
        console.log(getError.error,":",getError.message)
        return getError as DeleteResponse;
    }else{
        //非後端error
        console.log("An unexpected error occurred",":",error.message)
        return {
            message: "An unexpected error occurred",
            error: error.message
        }as DeleteResponse;
    }
}
}

const article = { GET, PUT, DELETE}
export default article
