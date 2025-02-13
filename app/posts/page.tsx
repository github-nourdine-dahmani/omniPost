import { getAllPosts } from "@/lib/posts";
import PostItem from "@/components/PostItem";

// Add metadata export
export const metadata = {
    title: "AzNews - Latest Posts",
    description: "Latest news and articles from AzNews",
};

// Add revalidate
export const revalidate = 3600; // revalidate every hour

export default async function Posts() {
    const posts = await getAllPosts();
    
    return (
        <>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Latest Posts
                </h1>
                <div className="grid gap-8">
                    {posts.map((post) => (
                        <PostItem key={post.id} post={post} />
                    ))}
                </div> 
            </main>
        </>
    );
}
