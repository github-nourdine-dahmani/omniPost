'use client'
import ArticleCard from "@/components/ArticleCard";
import { useState } from "react";
import ArticleDrawer from "@/components/ArticleDrawer";
import { Article } from "@prisma/client";

export default function ArticlesPageClient({ articles }: { articles: Article[] }) {

    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [article, setArticle] = useState<Article | null>(null);

    const openDrawer = (article: Article) => {
        setArticle(article);
        setIsEditDrawerOpen(true);
    };

    const closeDrawer = () => {
        setArticle(null);
        setIsEditDrawerOpen(false);
    };

    return (
        <>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
                {/* Left Section: Categories and Filters */}
                <div className="w-1/4 pr-4 border-r">
                    <h2 className="text-xl font-semibold mb-4">Filters</h2>
                    {/* Add filter components here */}
                    <div>
                        <h3 className="text-lg font-medium mb-2">Categories</h3>
                        {/* Example category list - replace with actual categories */}
                        <ul>
                            <li className="mb-2">
                                <label className="inline-flex items-center">
                                    <input type="checkbox" className="form-checkbox" />
                                    <span className="ml-2">Technology</span>
                                </label>
                            </li>
                            <li className="mb-2">
                                <label className="inline-flex items-center">
                                    <input type="checkbox" className="form-checkbox" />
                                    <span className="ml-2">Politics</span>
                                </label>
                            </li>
                            <li className="mb-2">
                                <label className="inline-flex items-center">
                                    <input type="checkbox" className="form-checkbox" />
                                    <span className="ml-2">Sports</span>
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right Section: Article List */}
                <div className="w-3/4 pl-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">
                        Latest Headlines
                    </h1>
                    <div className="grid gap-8">
                        {articles.map((article, index) => (
                            <ArticleCard key={index} article={article} openDrawer={() => openDrawer(article)} />
                        ))}
                    </div>
                </div>

                {/* Edit Drawer */}
                <ArticleDrawer
                    article={article}
                    isOpen={isEditDrawerOpen}
                    onClose={() => closeDrawer()}
                />
            </main>
        </>
    );
}
