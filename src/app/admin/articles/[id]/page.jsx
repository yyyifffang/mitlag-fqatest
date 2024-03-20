'use client'
// styles
import styles from "./page.module.scss"
import "highlight.js/styles/github.css"
import "@/utils/markdown/md.css"
// bootstrap
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
// next
import { useEffect, useState } from 'react'
// components
import MessageModal from "@/components/MessageModal/MessageModal"
import PageSpinner from "@/components/PageSpinner/PageSpinner"
import CoverModal from "./CoverModal"
// api
import { default as apiImageFormdata } from "@/api/imageFormdata"
import { default as apiArticle } from "@/api/sudo/article"
// 引入 Markdown 相關模組
import parse from "html-react-parser"
import markdownit from "markdown-it"
import { mdOpt } from "@/utils/markdown/md"
// 初始化 Markdown 轉換器
const md = markdownit(mdOpt)
const mdToHtml = (text) => md.render(text)
// 定義使用者打字暫停時間 (ms)
const userTypingTimeout = 3000

export default function Id({ params }) {
    const uuid = params.id // 文章 uuid
    const [config, setConfig] = useState({
        isLoading: true, // 第一次載入文章
        isNotFound: false, // 找不到文章
        isSubmiting: false, // 正在提交
        isError: false, // 提交出現錯誤
        showingCoverModal: false, // 更改封面視窗
    })
    const [article, setArticle] = useState({
        uuid: uuid,
        title: "",
        content: "",
        cover_image_url: null,
        tags: "null",
        is_published: false,
        creation_date: "",
        modification_date: null
    })
    const [typingTimeout, setTypingTimeout] = useState(null)

    /* 初始化時抓取文章 */
    useEffect(() => {
        async function init() {
            const response = await apiArticle.GET(uuid)
            setConfig(prev => ({...prev, isLoading:false}))
            if (!response.error) {
                const { uuid, title, content, cover_image_url, tags, is_published,
                    creation_date, modification_date } = response.data
                setArticle({
                    uuid, title, content, cover_image_url,
                    tags: tags === null? "null": tags,
                    is_published, creation_date, modification_date
                })
            } else {
                setConfig(prev => ({...prev, isNotFound:true}))
            }
        }
        init()
    }, [uuid])
    /* 提交文章 */
    useEffect(() => {
        if (!config.isSubmiting) return
        const payload = {
            ...article,
            tags: article.tags === "null"? null: article.tags
        }
        updateRemote(payload)
        async function updateRemote(payload) {
            const response = await apiArticle.PUT(uuid, payload)
            goingSubmit(false)
            if (!response.error) {
                console.log(response)
            } else {
                setConfig(prev => ({...prev, isError:true}))
            }
        }
    }, [uuid, article, config.isSubmiting])
    
    // ==================================================
    /* 內文相關函式 */
    // 使用者輸入內文時
    function onContentInput(e) {
        // 將四個空白替換成 '\t'
        const scroll_x = e.target.scrollLeft
		const scroll_y = e.target.scrollTop
        const startPos = e.target.selectionStart
        const endPos = e.target.selectionEnd
        const value =  e.target.value
        const onFocus = value.search("    ") > 0
        const content = value.replace("    ", '\t')
        setArticle(prev => ({...prev, content:content}))
        if (onFocus) {
            setTimeout(() => {
                e.target.selectionStart = startPos - 3;
                e.target.selectionEnd = endPos - 3;
                e.target.scrollLeft = scroll_x
                e.target.scrollTop = scroll_y
            }, 10)
        }
        // 計時器，當使用者停止打字一段時間後觸發提交
        clearTimeout(typingTimeout)
        const timeoutId = setTimeout(() => {
            goingSubmit(true)
        }, userTypingTimeout)
        setTypingTimeout(timeoutId)
    }
    // 使用者輸入內文時偵測鍵盤
    function onContentKeyDown(e) {
        // tab 按下時插入 '\t'
        if (e.key === 'Tab') {
            e.preventDefault()
            document.execCommand('insertText', false, '\t')
        }
    }
    // 使用者在內文貼上時
    function onContentPaste(e) {
        // 將貼上的圖片轉成檔案並上傳
        let file = null
        for (let i=0; i<e.clipboardData.items.length; i++) {
        const item = e.clipboardData.items[i]
        if (item.type.indexOf("image") !== -1) {
            file = item.getAsFile()
            break
        }
        }
        if (file !== null) uploadImage(e, file)
    }
    // 內文中的圖片上傳處理
    async function uploadImage(e, file) {
        const scroll_x = e.target.scrollLeft
		const scroll_y = e.target.scrollTop
        const startPos = e.target.selectionStart
        const endPos = e.target.selectionEnd
        // 插入錨點
        const rand_str = Math.random().toString(36).substring(3,9)
        const anchor_str = `![Uploading file... ${rand_str}]()`
        setArticle(prev => {
            const content = prev.content.substring(0, startPos) + anchor_str + prev.content.substring(endPos)
            return {...prev, content:content}
        })
        setTimeout(() => {
            e.target.selectionStart = startPos + anchor_str.length
            e.target.selectionEnd = endPos + anchor_str.length
            e.target.scrollLeft = scroll_x
            e.target.scrollTop = scroll_y
        }, 10)
        // 上傳圖片
        const formData = new FormData()
        formData.append("image", file)
        const response = await apiImageFormdata.POST(formData)
        // 替換錨點
        const replace_str = response.error? "![error]()": `![](${response.image_path})`
        setArticle(prev => {
            const content = prev.content.replace(anchor_str, replace_str)
            return {...prev, content:content}
        })
        setTimeout(() => {
            e.target.selectionStart = startPos + replace_str.length
            e.target.selectionEnd = endPos + replace_str.length
            e.target.scrollLeft = scroll_x
            e.target.scrollTop = scroll_y
        }, 10)
        // 圖片上傳完成後觸發提交
        goingSubmit(true)
    }
    
    // ==================================================
    /* 標題 封面 ... 相關函式 */
    // 標題
    function onTitleChange(e) {
        const title = e.target.value
        setArticle(prev => ({...prev, title:title}))
    }
    function onTitleKeyDown(e) {
        if (e.key === 'Enter' || e.key === 'Escape') e.target.blur()
    }
    function onTitleBlur() {
        // 失焦後觸發上傳
        goingSubmit(true)
    }
    // 封面
    function setCoverSrc(src) {
        // 封面變更後觸發上傳
        setArticle(prev => ({...prev, cover_image_url:src}))
        goingSubmit(true)
    }
    function setCoverModalShow(showing) {
        // 封面圖視窗是否顯示
        setConfig(prev => ({...prev, showingCoverModal:showing}))
    }
    // 標籤
    function onTagChange(e) {
        // 更換標籤後觸發上傳
        const tags = e.target.value
        setArticle(prev => ({...prev, tags:tags}))
        goingSubmit(true)
    }
    // 發布
    function togglePublished() {
        // 按下按鈕後觸發上傳
        setArticle(prev => ({...prev, is_published:!prev.is_published}))
        goingSubmit(true)
    }

    /* 觸發上傳 */
    function goingSubmit(submit) {
        setConfig(prev => ({...prev, isSubmiting:submit}))
    }
    
    // ==================================================
    return (<>
        {/* 載入頁面時顯示動畫 */}
        <PageSpinner
            showing={config.isLoading}
            hideHeader={true}
        />
        {
            // 文章不存在時跳出提示視窗
            config.isNotFound?
            <MessageModal
                mode={1}
            />:
            <>
                {
                    // 提交發生錯誤跳出提示視窗
                    config.isError &&
                    <MessageModal
                        mode={2}
                    />
                }
                {
                    // 封面圖視窗
                    ! config.isLoading &&
                    <CoverModal
                        coverSrc={article.cover_image_url}
                        setCoverSrc={setCoverSrc}
                        show={config.showingCoverModal}
                        setShow={setCoverModalShow}
                    />
                }
                <div className={styles.header}>
                    <InputGroup>
                        <Form.Select
                            style={{maxWidth:"max-content"}}
                            value={article.tags}
                            onChange={onTagChange}
                            disabled={config.isLoading | config.isSubmiting}
                        >
                            <option value="null">無標籤</option>
                            <option value="Research-Area">研究方向</option>
                            <option value="Life-Records">生活紀錄</option>
                        </Form.Select>
                        <Form.Control
                            placeholder="無標題"
                            value={article.title}
                            onChange={onTitleChange}
                            onKeyDown={onTitleKeyDown}
                            onBlur={onTitleBlur}
                            disabled={config.isLoading | config.isSubmiting}
                        />
                        <Button
                            variant="success"
                            style={{width:"120px"}}
                            onClick={() => setCoverModalShow(true)}
                            disabled={config.isLoading | config.isSubmiting}
                        >封面圖</Button>{' '}
                        <Button
                            variant="danger"
                            style={{width:"120px"}}
                            onClick={togglePublished}
                            disabled={config.isLoading | config.isSubmiting}
                        >
                            { article.is_published? "取消發布": "發布" }
                        </Button>{' '}
                        <Button
                            variant="primary"
                            style={{width:"120px"}}
                            onClick={() => goingSubmit(true)}
                            disabled={config.isLoading | config.isSubmiting}
                        >
                            { config.isSubmiting &&
                                <>
                                    <Spinner
                                        as="span" animation="grow"
                                        size="sm" role="status" aria-hidden="true"
                                    />
                                </>
                            } 儲存
                        </Button>
                    </InputGroup>
                </div>
                <main className={styles.article}>
                    <textarea className={styles.input_area}
                        placeholder="輸入文章內容..."
                        value={article.content}
                        onInput={onContentInput}
                        onKeyDown={onContentKeyDown}
                        onPaste={onContentPaste}
                        disabled={config.isLoading}
                    />
                    <div className={styles.preview_area}>
                        <div>{parse(mdToHtml(article.content))}</div>
                    </div>
                </main>
            </>
        }
    </>)
}
