import { ArticleSeed } from "@/types";
import { UnplugIcon, EyeIcon, TrashIcon, SaveIcon, PenIcon } from "lucide-react";

export default function ArticleSeedCard({ article, openReviewDrawer, openEditDrawer, unsaveArticle, isSaved = false }: { article: ArticleSeed, openReviewDrawer: () => void, openEditDrawer: () => void, unsaveArticle: () => void, isSaved: boolean }) {
    return (
        <div className={isSaved ? "relative mb-2 p-0.5 bg-gradient-to-br from-purple-500 to-pink-500" : "relative mb-2"}>

            <article
                key={article.externalId}
                className="bg-white shadow-lg overflow-hidden hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            >
                <div className="flex flex-row items-stretch m-8">
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
                            <span>{article?.author || 'Unknown author'}</span>
                            <span className="mx-2">·</span>
                            <span>{article?.category || 'Unknown Category'}</span>
                            <span className="mx-2">·</span>
                            <span>
                                {article?.publishDate?.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                            </span>
                        </div>

                        <div className="flex items-center justify-end mt-4">
                            {!isSaved &&
                                <button onClick={openReviewDrawer} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                        Review <EyeIcon className="w-4 h-4 inline-block" />
                                    </span>
                                </button>}

                            {isSaved &&
                                <button onClick={unsaveArticle} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
                                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                        Offboard Article <UnplugIcon className="h-4 w-4 ml-1 inline-block" />
                                    </span>
                                </button>
                            }

                            {isSaved &&
                                <button type="button" onClick={openEditDrawer} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                        Edit <PenIcon className="w-4 h-4 inline-block" />
                                    </span>
                                </button>
                            }
                        </div>

                    </div>
                </div>
            </article>
        </div>
    )
}