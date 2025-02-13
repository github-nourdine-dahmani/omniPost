import { Post } from "@/types";
import Link from "next/link";

export default function PostCard({ post }: { post: Post }) {
    return (
        <Link href={`/posts/${post.slug}`}>
            <article
                key={post.id}
                className="bg-white shadow rounded-lg overflow-hidden hover:bg-gray-50 transition-colors duration-200 cursor-pointer flex flex-col h-full"
            >
                {post.images && post.images[0] && (
                    <div className="aspect-w-16 aspect-h-9">
                        <img
                            src={post.images[0].url}
                            alt={post.images[0].alt || post.title}
                            className="object-cover w-full h-48"
                        />
                    </div>
                )}
                <div className="p-6 flex-grow flex flex-col">
                    <h2 className="text-xl font-semibold text-gray-900 hover:text-gray-700 mb-2">
                        {post.title}
                    </h2>
                    {post.excerpt && (
                        <p className="mt-auto text-gray-600 mb-4">
                            {post.excerpt}
                        </p>
                    )}
                    <div className="flex items-center text-sm text-gray-500">
                        <img
                            src={
                                post?.author?.avatar ||
                                "https://via.placeholder.com/40"
                            }
                            alt={post?.author?.name}
                            className="w-10 h-10 rounded-full mr-2"
                        />
                        <span>{post?.author?.name}</span>
                        <span className="mx-2">·</span>
                        <span>
                            {new Date(
                                post.publishedAt || post.createdAt
                            ).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    )
}