import ArticlePage from "@/components/all-articles";
import Articles from "@/components/article-hero";
import WikipediaHeader from "@/components/main-head";
import { Suspense } from "react";

export default function Page() {
    return (
        <div className="">
            <WikipediaHeader />
            <Articles />

            {/* 🧠 Suspense required here for client-side logic (useSearchParams) */}
            <Suspense fallback={<div>Loading articles...</div>}>
                <ArticlePage />
            </Suspense>
        </div>
    );
}







