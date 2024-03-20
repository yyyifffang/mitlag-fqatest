// styles
import styles from "./page.module.scss"
import "highlight.js/styles/github.css"
import "@/utils/markdown/md.css"
// bootstrap
import Badge from 'react-bootstrap/Badge'
// next
import Image from 'next/image'
import dynamic from 'next/dynamic'
// components
const MessageModal = dynamic(() => import('@/components/MessageModal/MessageModal'), { ssr: false })
// api
import { default as apiArticle } from "@/api/article/article"
// 引入 Markdown 相關模組
import parse from "html-react-parser"
import markdownit from "markdown-it"
import { mdOpt } from "@/utils/markdown/md"
// 初始化 Markdown 轉換器
const md = markdownit(mdOpt)
const mdToHtml = (text) => md.render(text)

export default async function Id({ params }) {
    const uuid = params.id // 文章 uuid
    const response = await apiArticle.GET(uuid) // 從 API 獲取文章資料
    const { data } = response
    const isError = !data // 判斷是否為錯誤狀態
    return (<>
        {
            isError? <MessageModal mode={1} />:
            <main className={styles.main}>
                <h1>{data.title}</h1>
                <br />
                    {
                        data.cover_image_url &&
                        <Image
                            src={data.cover_image_url}
                            alt="cover"
                            width={0} height={0}
                            sizes="100%"
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxWidth: "max-content",
                                borderRadius:"20px",
                                margin:"0 auto"
                            }}
                        />
                    }
                <br />
                <div className={styles.meta}>
                    {
                        data.creation_date &&
                        <div>建立日期{' '}
                            {data.creation_date.split('T')[0].replaceAll("-", "/")}{' '}
                            {data.creation_date.split('T')[1].substring(0, 5)}
                        </div>
                    }
                    {
                        data.modification_date &&
                        <div>上次更動{' '}
                            {data.modification_date.split('T')[0].replaceAll("-", "/")}{' '}
                            {data.modification_date.split('T')[1].substring(0, 5)}
                        </div>
                    }
                    <div><Badge bg="secondary">{data.tags}</Badge></div>
                </div>
                <br />
                <div>{parse(mdToHtml(data.content))}</div>
            </main>
        }
    </>)
}
