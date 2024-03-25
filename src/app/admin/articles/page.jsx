'use client'
import styles from "./page.module.scss"
import ArticleList from "./ArticleList";

export default function Admin() {
  return (
    <main>
        <div className={styles.adminHeader}>文章管理頁面</div>
      <ArticleList/>
    </main>
  )
}
