import styles from "./page.module.scss"
import * as React from "react";
import ArticleShow from "./ArticleShow"

export default function Articles({params, searchParams}) {
    const {tag} = searchParams
    const newTag = (tag === "life-records")? "Life-Records":
    (tag === "research-area")? "Research-Area": ""

    //title隨tag更換
    let title;
    switch (newTag){
        case 'Research-Area' :
            title = "研究方向";
            break;
        case 'Life-Records' :
            title = '生活紀錄';
            break;
    }

    return(
        <>
            <div className={styles.pageTitle}>
                {title}
            </div> 
            <div>
                <ArticleShow 
                    tag = {newTag}
                />
            </div>
        </>
    )
}

