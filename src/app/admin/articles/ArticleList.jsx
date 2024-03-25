'use client'
import React, { useState, useEffect} from 'react';
import ArticleRow from './ArticleRow';
import styles from './ArticleListAndRow.module.scss'
import ReactPaginate from 'react-paginate';
import { useRouter } from 'next/navigation';

//api
import { default as apiArticle } from '@/api/sudo/article'
import { default as fetchAllArticles } from '@/api/sudo/fetchAllArticles'
import { default as apiTags } from '@/api/article/tags'

//bootstrap
import { Button } from 'react-bootstrap';

//react-icons
import { GoSortAsc, GoSortDesc } from 'react-icons/go';

export default function ArticleList() {
    //跳轉頁面
    const router = useRouter();
    //取得文章列表
    const [articles, setArticles] = useState([]);
    //篩選標籤
    const [filterTag, setFilterTag] = useState('');
    //搜尋文章標題
    const [searchTitle, setSearchTitle] = useState("");
    //排序日期
    const [sortDirection, setSortDirection] = useState('desc');
    //get後端tag
    const [tags, setTags] = useState([]);
    //當前頁碼，ReactPaginate使用0當第一頁
    const [currentPage, setCurrentPage] = useState(0);
    //每頁顯示幾篇文章
    const [articlesPerPage,setArticlesPerPage] = useState(20);
    //有幾頁
    const [pageCount,setPageCount] = useState(0);
    //這一頁顯示的文章有哪些
    const [currentArticles,setCurrentArticles] = useState([]);

    useEffect(() => {
        //取得所有文章
        const getAllArticles = async () => {
            const response = await fetchAllArticles.GET();
            if (response.data) {
                setArticles(response.data);
            }
        };
        getAllArticles();
        //獲取後端寫死的所有tags
        const getAllTags = async () => {
            const tagsResponse = await apiTags.GET();
            if (tagsResponse.tags) {
                setTags(tagsResponse.tags);
            }
        };
        getAllTags();
    }, []); //[]表示effect只在組件加載時運行一次

    //根據螢幕大小調整每頁顯示文章數量
    useEffect(()=>{
        const checkScreenSize = () => {
            if (window.matchMedia("(max-width: 768px)").matches){
                //手機裝置
                setArticlesPerPage(10);
            }else{
                //非手機裝置
                setArticlesPerPage(20);
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


    //刪除文章功能
    const DeleteArticle = async (uuid) => {
        const response = await apiArticle.DELETE(uuid);
        if (response) {
            const updateArticles = articles.filter(article => article.uuid !== uuid);
            setArticles(updateArticles);
        };
    };

    //切換發布狀態
    const togglePublishedStatus = async(article) => {
        //繼承文章所有data，並將發布狀態設為相反值
        const updateArticles = { ...article, is_published: !article.is_published,};
        const response = await apiArticle.PUT(article.uuid , updateArticles);
        if (!response.error) {
            //更新前端UI介面
            setArticles(articles.map(item =>
                //找到欲更新文章的uuid並更新發布狀態
                item.uuid === article.uuid ? { ...item,is_published: !item.is_published} : item
            ));
        }else{
            alert(`Failed to update: ${response.message}`);
        }
    }

    const handleAddArtcle = async() => {
        try{
            //發送post請求
            const response = await fetchAllArticles.POST();
            const uuid = response.data.uuid;
            router.push(`/admin/articles/${uuid}`)
        }catch(error){
            console.log('Error adding new article: ',error);
        }
    }

    //標籤篩選功能
    //篩選器改變時更新狀態
    const handleFilterChange = (event) => {
        setFilterTag(event.target.value);
    };

    //搜尋文章標題功能
    const handleSearchTitle = (event) => {
        setSearchTitle(event.target.value);
    }
    //時間排序
    const toggleSortDirection = () => {
        setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
    };


    //篩選結果
    const filteredArticles = currentArticles
        .filter(article => {
            let tagMatch =true;
            if (filterTag === "noTag"){
                //篩選出沒有標籤的文章
                tagMatch = !article.tags
            }else if (filterTag) {
                //檢查文章是否具有tags，若有則將標籤拆分為陣列並用include檢查是否包含指定tag
                tagMatch = article.tags && article.tags.split(",").map(tag => tag.trim()).includes(filterTag);
            }
            //檢查標題，忽略大小寫
            const titleMatch = article.title.toLowerCase().includes(searchTitle.toLowerCase());
            return tagMatch && titleMatch
        })
        //a,b為排序函數中兩個待比較的文章
        .sort((a, b) => {
            const dateA = new Date(a.creation_date);
            const dateB = new Date(b.creation_date);
            return sortDirection === 'asc' ? dateA - dateB : dateB - dateA
        });


    //渲染文章列表
    return (
        <>
            <div className={styles.searchAndFilterContainer}>
                <div style={{ display: 'flex', flexGrow: 1, gap: '8px' }}>
                    <input
                        type='text'
                        className={styles.searchInput}
                        placeholder='搜尋文章標題...'
                        value={searchTitle}
                        onChange={handleSearchTitle}
                    />
                </div>
                <select
                    className={styles.filterSelect}
                    onChange={handleFilterChange}
                    value={filterTag}
                >
                    <option value="">所有文章</option>
                    <option value="noTag">無標籤</option> {/*用於顯示沒有任何標籤的文章*/}
                    {tags.map((tag) => (
                        <option key={tag} value={tag}>{tag}</option>
                    ))}
                </select>
                <div>
                    <button 
                        className={styles.addArticleButton}
                        onClick={handleAddArtcle}
                    >
                        新增文章
                    </button>
                </div>
            </div>
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>發佈狀態</th>
                            <th>文章標題</th>
                            <th>標籤</th>
                            <th>
                                建立日期
                                <Button
                                    variant="link" 
                                    onClick={toggleSortDirection}
                                    className={styles.sortButton}
                                >
                                    {sortDirection === 'asc' ? <GoSortAsc /> : <GoSortDesc />}
                                </Button>
                            </th>
                            <th>修改日期</th>
                            <th>編輯</th>
                            <th>刪除</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredArticles.map(article => (
                            <ArticleRow
                                key={article.uuid}
                                article={article}
                                DeleteData={DeleteArticle}
                                changePublishStatus = {togglePublishedStatus}
                            />
                        ))}

                    </tbody>
                </table>
            </div>
            { articles.length > articlesPerPage && (
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
    );
}