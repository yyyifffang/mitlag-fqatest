'use client'
// bootstrap
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
// api
import { default as apiImageFormdata } from "@/api/imageFormdata"
// next
import Image from 'next/image'
import { useRef, useState } from 'react'

// 定義初始狀態
const configDefaultValue = {
    uploading: false,
    isError: false
}

// 用於顯示和修改封面圖片
export default function CoverModal({ coverSrc, setCoverSrc, show, setShow }) {
    const fileRef = useRef() // input[type=file]
    const [imageSrc, setImageSrc] = useState(coverSrc) // 圖片預覽
    const [config, setConfig] = useState(configDefaultValue) // 上傳狀態
    
    /* 圖片相關函式 */
    // 按下 button 後觸發檔案選擇
    function openFile() {
        fileRef.current.click()
    }
    // 圖片選擇完成後，立刻顯示
    function onFileChange(e) {
        const inputFile = e.target.files[0]
        if (inputFile) {
            const previewSrc = URL.createObjectURL(inputFile)
            setImageSrc(previewSrc)
        }
    }
    // 上傳圖片至後端伺服器
    async function uploadImage() {
        const file = fileRef.current.files[0]
        const formData = new FormData()
        formData.append("image", file)
        setConfig(prev => ({...prev, isError:false})) // 清除之前的錯誤狀態
        setConfig(prev => ({...prev, uploading:true})) // 設定為上傳中狀態
        const response = await apiImageFormdata.POST(formData) // 呼叫 API
        setConfig(prev => ({...prev, uploading:false})) // 設定為非上傳中狀態
        if (!response.error) {
            fileRef.current.value = null // 清空選擇的檔案
            setImageSrc(response.image_path) // 設定圖片預覽為後端回傳的路徑
            setCoverSrc(response.image_path) // 更新父元件中的封面圖片路徑
            setShow(false) // 關閉(隱藏) Modal
        } else {
            setConfig(prev => ({...prev, isError:true})) // 設定錯誤狀態
        }
    }
    // 手動關閉視窗時觸發
    function onClose() {
        setImageSrc(coverSrc) // 還原至預設封面圖片
        setConfig(configDefaultValue) // 還原狀態至初始值
        setShow(false) // 關閉(隱藏) Modal
    }
    
    // ==================================================
    return (<>
        <Modal show={show} backdrop="static" keyboard={false}>
            <Modal.Header>
                <Modal.Title>封面圖</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Image
                    width={500} height={250}
                    src={imageSrc? imageSrc: "/image-not-found.png"}
                    alt="cover"
                    style={{objectFit: 'contain'}}
                />
            </Modal.Body>
            {
                /* 錯誤時顯示警告訊息 */
                config.isError && 
                <Alert variant="warning" className='m-0 p-2 text-center rounded-0'>
                    發生錯誤，請再試一次
                </Alert>
            }
            <Modal.Footer style={{display:"flex", justifyContent:"space-between"}}>
                <div>
                    {/* 選擇檔案(隱藏) */}
                    <input type="file"
                        accept="image/*"
                        style={{display:"none"}}
                        ref={fileRef}
                        onInput={onFileChange}
                    />
                    {/* 選擇檔案用 */}
                    <Button 
                        variant="secondary"
                        onClick={openFile}
                        disabled={config.uploading}
                    >選擇檔案</Button>
                </div>
                <div>
                    {/* 關閉視窗用 */}
                    <Button 
                        variant="secondary"
                        onClick={onClose}
                        disabled={config.uploading}
                    >取消</Button>{' '}
                    {/* 上傳圖片用 */}
                    <Button 
                        variant="primary"
                        onClick={uploadImage}
                        disabled={config.uploading || imageSrc == coverSrc}
                    >
                        { config.uploading &&
                            <>
                                <Spinner
                                    as="span" animation="grow"
                                    size="sm" role="status" aria-hidden="true"
                                />
                            </>
                        } 確認變更
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    </>)
}
