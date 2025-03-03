"use client";
import { useState, useCallback } from "react";
import { Job, ArticleSeed } from "@prisma/client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ArticleSeedCard from "@/components/ArticleSeedCard";
import TopNewsCard from "@/components/TopNewsCard";
import ArticleSeedDrawer from "@/components/ArticleSeedDrawer";
import TopNewsDrawer from "@/components/TopNewsDrawer";
import PostDrawer from "@/components/PostDrawer";
import { useArticleSeedDrawer } from "@/components/ArticleSeedDrawer/hooks/useArticleSeedDrawer";
import { useTopNewsDrawer } from "@/components/TopNewsDrawer/hooks/useTopNewsDrawer";
import { usePostDrawer } from "@/components/PostDrawer/hooks/usePostDrawer";
import { SeedsFilterSection } from "@/components/SeedsFilterSection";
import { useJobManagement } from "@/hooks/useJobManagement";
import { TopNews } from "@/types";
import { deleteArticleSeed } from "@/lib/articleSeeds";
import { useTopNewsManagement } from "@/hooks/useTopNewsManagement";

export default function ArticlesPageClient({ jobs: initialJobs }: { jobs: Job[] }) {
    const { jobs, selectedJob, setSelectedJob, refreshSelectedJob } = useJobManagement(initialJobs);

    const {
        categories,
        filteredTopNews,
        selectedCategories,
        activeView,
        setSelectedCategories,
        setActiveView,
        handleCategoryToggle,
    } = useTopNewsManagement(selectedJob);

    const [selectedArticleSeed, setSelectedArticleSeed] = useState<ArticleSeed | null>(null);
    const [selectedTopNews, setSelectedTopNews] = useState<TopNews | null>(null);
    const { isOpen: isArticleSeedDrawerOpen, openDrawer: openArticleSeedDrawer, closeDrawer: closeArticleSeedDrawer } = useArticleSeedDrawer();
    const { isOpen: isTopNewsDrawerOpen, openDrawer: openTopNewsDrawer, closeDrawer: closeTopNewsDrawer } = useTopNewsDrawer();
    const { isOpen: isPostDrawerOpen, openDrawer: openPostDrawer, closeDrawer: closePostDrawer } = usePostDrawer();

    const handleJobSelect = useCallback((job: Job) => {
        setSelectedJob(job);
        setSelectedCategories([]);
    }, [setSelectedJob, setSelectedCategories]);

    const offboardArticleSeed = useCallback(async (articleSeed: ArticleSeed) => {
        await deleteArticleSeed(articleSeed);
        await refreshSelectedJob();
    }, [refreshSelectedJob]);

    return (
        <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex h-[calc(100vh-4rem)]">
            <SeedsFilterSection
                jobs={jobs}
                categories={categories}
                selectedJob={selectedJob}
                selectedCategories={selectedCategories}
                onJobSelect={handleJobSelect}
                onCategoryToggle={handleCategoryToggle}
            />

            <div className="w-3/4 pl-4 overflow-y-auto">
                <div className="p-2 sticky top-0 bg-white z-10">
                    <ToggleGroup
                        type="single"
                        className="flex justify-center mb-4"
                        value={activeView}
                        onValueChange={(
                            value: "all" | "offboarded" | "onboarded"
                        ) => setActiveView(value)}
                    >
                        <ToggleGroupItem value="all">All</ToggleGroupItem>
                        <ToggleGroupItem value="offboarded">
                            Offboarded
                        </ToggleGroupItem>
                        <ToggleGroupItem value="onboarded">
                            Onboarded
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>

                <div className="grid">
                    {filteredTopNews.map((topNews, index) => {
                        // console.log(">>>> rawArticleSeed", rawArticleSeed);

                        const articleSeed = topNews.articleSeed;

                        return (
                            !articleSeed ?
                                <TopNewsCard
                                    key={index}
                                    topNews={topNews}
                                    openTopNewsDrawer={() => {
                                        setSelectedTopNews(topNews);
                                        openTopNewsDrawer();
                                    }}
                                />
                                :
                                <ArticleSeedCard
                                    key={index}
                                    articleSeed={articleSeed}
                                    openArticleSeedDrawer={() => {
                                        setSelectedArticleSeed(articleSeed);
                                        setSelectedTopNews(topNews);
                                        openArticleSeedDrawer();
                                    }}
                                    openPostDrawer={() => {
                                        setSelectedArticleSeed(articleSeed);
                                        openPostDrawer();
                                    }}
                                    offboardArticleSeed={() =>
                                        offboardArticleSeed(articleSeed)
                                    }
                                />
                        );
                    })}
                </div>
            </div>

            <ArticleSeedDrawer
                articleSeed={selectedArticleSeed}
                topNews={selectedTopNews}
                isOpen={isArticleSeedDrawerOpen}
                onClose={closeArticleSeedDrawer}
                refreshParent={() => refreshSelectedJob()}
            />

            <TopNewsDrawer
                topNews={selectedTopNews}
                isOpen={isTopNewsDrawerOpen}
                onClose={closeTopNewsDrawer}
                refreshParent={refreshSelectedJob}
            />

            <PostDrawer
                articleSeed={selectedArticleSeed}
                selectedPost={null}
                isOpen={isPostDrawerOpen}
                onClose={closePostDrawer}
                refreshParent={refreshSelectedJob}
            />

        </main>
    );
}
