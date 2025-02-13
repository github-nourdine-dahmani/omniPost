import { Article } from "@prisma/client";
import Link from "next/link";

export default function ArticleCard({ 
    article, 
    openDrawer 
}: { 
    article: Article; 
    openDrawer?: () => void; 
}) {
    return (
        // <div onClick={openDrawer}>
            <Link href={`/articles/${article.slug}`}>
                <article
                    key={article.externalId}
                    className="bg-white shadow rounded-lg overflow-hidden hover:bg-gray-50 transition-colors duration-200 cursor-pointer flex flex-row items-stretch h-full"
                >
                    {article.image && (
                        <div className="w-1/3 min-w-[200px]">
                            <img
                                src={article.image}
                                alt={article.title}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    )}
                    <div className="p-6 flex-grow flex flex-col justify-between w-2/3">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 hover:text-gray-700 mb-2">
                                {article.title}
                            </h2>
                            {article.summary && (
                                <p className="text-gray-600 mb-4">
                                    {article.summary}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                            <img
                                src={
                                    "https://via.placeholder.com/40"
                                }
                                alt={article.author ?? 'Unknown author'}
                                className="w-10 h-10 rounded-full mr-2"
                            />
                            <span>{article?.author}</span>
                            <span className="mx-2">·</span>
                            <span>
                                {article?.publishedAt?.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                </article>
            </Link>
        // </div>
    )
}