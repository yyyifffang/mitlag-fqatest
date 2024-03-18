import axios, { AxiosResponse } from 'axios'
import { timeout } from "@/api/config"
const baseURL = process.env.NEXT_PUBLIC_API_URL
const apiURL = "/api/image"

interface ImageResponse {
  message: string;
  image_path?: string;
  error?: string;
}

async function POST(formData: FormData): Promise<ImageResponse> {
  try {
    const response: AxiosResponse<ImageResponse> = await axios({
      method: "post",
      headers: { "Content-Type": "multipart/form-data" },
      data: formData,
      url: apiURL,
      baseURL: baseURL,
      timeout: timeout
    })
    return response.data
  } catch (error: any) {
    const responseData = (axios.isAxiosError(error) && error.response)
      ? error.response.data
      : {
        error: "An unexpected error occurred",
        message: error.message
      }
    console.log(responseData.error, ':', responseData.message)
    return responseData as ImageResponse
  }
}

const imageFormdata = { POST }
export default imageFormdata
