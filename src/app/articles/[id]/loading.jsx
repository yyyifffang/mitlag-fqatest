import PageSpinner from "@/components/PageSpinner/PageSpinner"

// 頁面載入時顯示動畫
export default function Loading() {
    return (
        <PageSpinner
            showing={true}
            hideHeader={false}
        />
    )
}
