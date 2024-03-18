'use client'
// bootstrap
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
// next
import { useRouter } from 'next/navigation'

export default function MessageModal({ mode }) {
    const router = useRouter()
    const message = (mode === 1)? "NotFound": 
                    (mode === 2)? "Error": ""

    function goLastPage() {
        router.back()
    }
    function goHomePage() {
        router.replace("/")
    }
    function reloadPage() {
        window.location.reload()
    }
    
    // ==================================================
    return (
        <Modal
            show={true} centered
            backdrop="static" keyboard={false}
        >
            <Modal.Header>
                <Modal.Title>{message}</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                {
                    (mode === 1)?
                    <>
                        <Button variant="primary" onClick={goHomePage}>主頁</Button>
                        <Button variant="primary" onClick={goLastPage}>上一頁</Button>
                    </>:
                    (mode === 2)?
                    <>
                        <Button variant="primary" onClick={reloadPage}>重新整理</Button>
                    </>:<></>
                }
            </Modal.Footer>
        </Modal>
    )
}
