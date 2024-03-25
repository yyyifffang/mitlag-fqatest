import React, { useState } from 'react';
import styles from './ArticleListAndRow.module.scss'
import Link from 'next/link';

//bootstrap
import { Modal, Button } from 'react-bootstrap';

export default function ArticleRow({ article, DeleteData, changePublishStatus}) {
     //刪除文章提示框
     const [deleteMessage,setDeleteMessage] = useState(false);
     const handleDeleteClose = () => setDeleteMessage(false);
     const handleDeleteShow = () => setDeleteMessage(true);
     const handleDelete = () =>{
        DeleteData(article.uuid);
        handleDeleteClose();
     }

     //發布文章提示框
     const [publishMessage,setPublishMessage] = useState(false);
     const handlePublishClose = () => setPublishMessage(false);
     const handlePublishShow = () => setPublishMessage(true);
     const handlePublish = () => {
        changePublishStatus(article);
        handlePublishClose();
     }


    return (
        <>
           <tr className={styles.tr}>
                <td >
                    <Button 
                        className={`${styles.button} ${article.is_published ? styles.published : styles.unpublished}`}
                        onClick = {handlePublishShow}
                    >
                        {article.is_published ? '已發佈' : '未發佈'}
                    </Button>
                    <Modal
                        show={publishMessage}
                        onHide={handlePublishClose}
                        keyboard={false}
                        centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>
                                {article.is_published ? `是否取消發布「${article.title}」？ ` : `是否發布「${article.title}」？`}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handlePublishClose}>
                                關閉
                            </Button>
                            {article.is_published ? (
                                <Button variant="danger" onClick={handlePublish}>
                                    取消發布
                                </Button>
                            ):(
                                <Button variant="danger" onClick={handlePublish}>
                                    確認發布
                                </Button>
                            )}
                        </Modal.Footer>
                    </Modal>
                </td>
                <td >{article.title}</td>
                <td >{article.tags}</td>
                <td >
                    {article.creation_date.split('T')[0].replaceAll("-","/")}{' '}
                    {article.creation_date.split('T')[1].substring(0,5)}

                </td>
                <td >
                    {article.modification_date ? (
                        <>
                            {article.modification_date.split('T')[0].replaceAll("-","/")}{' '}
                            {article.modification_date.split('T')[1].substring(0,5)}
                        </>
                    ): null}
                </td>
                <td >
                    <Link href={`/admin/articles/${article.uuid}`} passHref>
                        <button className={`${styles.button} ${styles.edit}`}>
                            編輯
                        </button>
                    </Link>
                </td>
                <td >
                    <Button className={`${styles.button} ${styles.delete}`} onClick={handleDeleteShow}>
                        刪除
                    </Button>
                    <Modal 
                        show={deleteMessage}
                        onHide={handleDeleteClose}
                        keyboard={false}
                        centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>確認刪除文章嗎?</Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleDeleteClose}>
                                關閉
                            </Button>
                            <Button variant="danger" onClick={handleDelete}>
                                確認刪除
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </td>
            </tr>
        </>
    )
};