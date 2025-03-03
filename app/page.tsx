import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

// Add metadata export
export const metadata = {
    title: "AzNews - Latest Posts",
    description: "Latest news and articles from AzNews",
};

// Add revalidate
export const revalidate = 3600; // revalidate every hour

export default async function Home() {
    const posts = await getAllPosts(false);

    console.log(posts)

    return (
        <>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Derniers articles
                </h1>

                <div className="grid grid-cols-3 gap-4">
                    {posts.map((post) => (
                        <article key={post.id} className="relative overflow-hidden rounded-lg shadow-sm transition hover:shadow-lg">
                            <Link href={`/post/${post.slug}`}>
                                <img
                                    alt=""
                                    src={post.coverImage}
                                    className="absolute inset-0 h-full w-full object-cover"
                                />

                                <div className="h-full relative bg-gradient-to-t from-gray-900/50 to-gray-900/25 pt-32 sm:pt-48 lg:pt-64">
                                    <div className="p-4 sm:p-6">
                                        <time datetime="2022-10-10" className="block text-xs text-white/90"> {post.publishedAt} </time>

                                        <a href="#">
                                            <h3 className="mt-0.5 text-lg text-white">{post.title}</h3>
                                        </a>

                                        <p className="mt-2 line-clamp-3 text-sm/relaxed text-white/95">
                                            {post.summary}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
            </main>
        </>
    );
}
