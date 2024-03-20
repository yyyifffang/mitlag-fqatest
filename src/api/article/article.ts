import axios, { AxiosResponse } from 'axios'
import { timeout } from "@/api/config"
const baseURL = process.env.NEXT_PUBLIC_API_URL
const apiURL = "/api/article"

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
interface ArticleResponse {
  message: string;
  data?: Data;
  error? :string;
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

const article = { GET }
export default article
