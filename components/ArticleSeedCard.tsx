import { ArticleSeed } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteArticle} from "@/lib/article";
import { CheckIcon, EyeIcon, TrashIcon, SaveIcon, PenIcon } from "lucide-react";

export default function ArticleSeedCard({ article, openPreviewDrawer, openEditDrawer, unsaveArticle, isSaved = false }: { article: ArticleSeed, openPreviewDrawer: () => void, openEditDrawer: () => void, unsaveArticle: () => void, isSaved: boolean }) {
    return (
        <div className="relative">

            <article
                key={article.externalId}
                className="bg-white shadow overflow-hidden hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
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
                            {!isSaved && <Button variant="outline" size="sm" className="flex items-center" onClick={openPreviewDrawer}>
                                Preview <EyeIcon className="w-4 h-4" />
                            </Button>}

                            {isSaved && <Button variant="outline" size="sm" className="flex items-center bg-red-500 hover:bg-red-600 text-white hover:text-white"  onClick={unsaveArticle}>
                                Unsave <TrashIcon className="w-4 h-4" />
                            </Button>
                            }

                            {isSaved && <Button variant="outline" size="sm" className="flex items-center bg-orange-500 hover:bg-orange-600 text-white hover:text-white" onClick={openEditDrawer}>
                                Edit <PenIcon className="w-4 h-4" />
                            </Button>
                            }
                        </div>

                    </div>
                </div>
            </article>
        </div>
    )
}