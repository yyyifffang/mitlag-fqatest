'use client'
import styles from "./ArticleShow.module.scss"
import React, { useState, useEffect } from 'react';
import ReactPaginate from "react-paginate";
import Link from "next/link";

//bootstrap
import { Card, Spinner } from 'react-bootstrap'

//取得特定tag文章的api
import {default as apiTagsArticles} from '@/api/article/tagsArticles'

export default function ArticleShow({tag}) {
    //儲存從後端API抓取的Research-Area文章
    const [articles, setArticles] = useState([]);
    //當前頁碼，ReactPaginate使用0當第一頁
    const [currentPage, setCurrentPage] = useState(0);
    //追蹤API請求是否完成
    const [loadingFinished, setLoadingFinished] = useState(false);
    //每頁顯示的文章數
    const [articlesPerPage,setArticlesPerPage] = useState(10);
    //有幾頁
    const [pageCount,setPageCount] = useState(0);
    //這一頁顯示的文章有哪些
    const [currentArticles,setCurrentArticles] = useState([]);

    //取得文章
    useEffect(() => {
        const getTagArticles = async () => {
            const response = await apiTagsArticles.GET(tag);
            if (response.data) {
                setArticles(response.data);
            }
            setLoadingFinished(true);
        };
        getTagArticles();
    }, [tag]);

    //根據螢幕大小調整每頁顯示文章數量
    useEffect(()=>{
        const checkScreenSize = () => {
            if (window.matchMedia("(max-width: 768px)").matches) {
                //手機裝置
                setArticlesPerPage(5);
            }else{
                //非手機裝置
                setArticlesPerPage(10);
            }
        };
        checkScreenSize();
        window.addEventListener('resize',checkScreenSize);
        return() => window.removeEventListener('resize',checkScreenSize);
    },[])

    //根據articlePerPage&currentPage更新顯示的文章
    useEffect(()=>{
        //計算總頁數
        const newPageCount = Math.ceil(articles.length / articlesPerPage);
        setPageCount(newPageCount);
        //計算要顯示的文章是從第幾篇到第幾篇
        const newCurrentArticles = articles.slice(currentPage * articlesPerPage, (currentPage + 1) * articlesPerPage);
        setCurrentArticles(newCurrentArticles);
    },[articlesPerPage,currentPage,articles])
    //頁碼切換
    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    }


    return (
        <>
            <div className={styles.articleShow}>
                {!loadingFinished && (
                    <div className={styles.loading}>
                        <Spinner animation="border" role="status" />
                        <span>正在加載文章...</span>
                    </div>
                )}
                {loadingFinished && articles.length === 0 ? (
                    //顯示沒有文章
                    <div className={styles.noArticleShow}>
                        <p>目前沒有可顯示的文章。</p>
                    </div>
                ) : (
                    //顯示文章
                    currentArticles.map(article => (
                        <Link key={article.uuid} href={`/articles/${article.uuid}`} passHref className={styles.articleBox} >
                            <Card>
                                <Card.Img 
                                    variant="top"
                                    src={article.cover_image_url || "https://fakeimg.pl/300/"} 
                                    alt={article.title} 
                                />
                                <Card.Body>
                                    <span>{article.modification_date}</span>
                                    <Card.Title>
                                        {article.title}
                                    </Card.Title>
                                </Card.Body>
                            </Card>
                        </Link>
                    ))
                )}
            </div>
            {articles.length > articlesPerPage &&  (
                <ReactPaginate
                    previousLabel={"< 上一頁"}
                    nextLabel={"下一頁 >"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={3}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={styles.pagination}
                    activeClassName={styles.active}
                    pageClassName={styles.pageItem}
                    pageLinkClassName={styles.pageLink}
                    previousClassName={styles.pageItem}
                    nextClassName={styles.pageItem}
                    breakClassName={styles.pageItem}
                />
            )}
        </>
    )
}