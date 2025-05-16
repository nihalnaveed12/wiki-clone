import ArticlePage from "@/components/all-articles";
import Articles from "@/components/article-hero";
import WikipediaHeader from "@/components/main-head";

export default function Page() {
    return (
        <div className="">
            <WikipediaHeader />
            <Articles />
            <ArticlePage />
        </div>
    )
}