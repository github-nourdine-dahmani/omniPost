import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";
import ArticleCard from "@/components/ArticleCard";
import PostItem from "@/components/PostItem";
// import { fetchHeadlines } from "@/lib/new sapi";
import { collectTopNews, getLatestJob } from "@/lib/worldnewsapi";
import { JobType } from "@/types";

// Add metadata export
export const metadata = {
    title: "AzNews - Latest Posts",
    description: "Latest news and articles from AzNews",
};

// Add revalidate
export const revalidate = 3600; // revalidate every hour

export default async function Home() {
    // const posts = await getAllPosts();
    // const latestJob = await getLatestJob(JobType.FetchTopNews);
    // const topNews = latestJob ? await collectTopNews(latestJob) : [];

    return (
        <>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Latest Headlines
                </h1>
                {/* <div className="grid gap-8">
                    {topNews.map((article, index) => (
                        <ArticleCard key={index} article={article} />
                    ))}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Latest Posts
                </h1>
                <div className="grid gap-8">
                    {posts.map((post) => (
                        <PostItem key={post.id} post={post} />
                    ))}
                </div> */}
            </main>
        </>
    );
}
