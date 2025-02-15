'use client'
import { useEffect, useState, useMemo, useCallback } from "react";
import { Article, Job } from "@prisma/client";
import { JobType } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ArticleSeedCard from "@/components/ArticleSeedCard";

import ArticleEditDrawer from "@/components/ArticleEditDrawer";
import ArticleReviewDrawer from "@/components/ArticleReviewDrawer";

import { ArticleSeed } from "@/types/article";
import { collectTopNews, persistArticleSeed } from "@/lib/worldnewsapi";
import { deleteArticle, resetArticle, updateArticle, refineArticle } from "@/lib/article";
import { getAllJobs, getJob } from "@/lib/job";

// Custom hook for managing jobs and selected job
const useJobManagement = (initialJobs: Job[]) => {
    const [jobs, setJobs] = useState(initialJobs);
    const [selectedJob, setSelectedJob] = useState(
        initialJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    );

    const refreshJobs = useCallback(async () => {
        console.log('refreshJobs')
        const updatedJobs = await getAllJobs(JobType.FETCH_TOP_NEWS);
        setJobs(updatedJobs);

        const previouslySelectedJob = updatedJobs.find(job => job.id === selectedJob.id);
        const newSelectedJob = previouslySelectedJob ||
            updatedJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        setSelectedJob(newSelectedJob);
    }, [selectedJob]);

    const refreshSelectedJob = useCallback(async () => {
        console.log('refreshSelectedJob')
        const updatedJobs = await getJob(selectedJob.id);

        if (!updatedJobs) {
            return;
        }

        // setJobs(updatedJobs);

        // const previouslySelectedJob = updatedJobs.find(job => job.id === selectedJob.id);

        setSelectedJob(updatedJobs);
    }, [selectedJob]);

    return { jobs, selectedJob, setSelectedJob, refreshJobs, refreshSelectedJob };
};

// Custom hook for managing article seeds and filtering
const useArticleSeedManagement = (selectedJob: Job) => {
    const [seedArticles, setSeedArticles] = useState<ArticleSeed[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [activeView, setActiveView] = useState<'all' | 'offboarded' | 'onboarded'>('all');

    useEffect(() => {
        console.log('useArticleSeedManagement')
        console.log(selectedJob.articles)
        const fetchAndProcessArticles = async () => {
            const fetchedSeedArticles = await collectTopNews(selectedJob);
            setSeedArticles(fetchedSeedArticles);
        };

        fetchAndProcessArticles();
    }, [selectedJob]);

    const categories = useMemo(() =>
        Array.from(new Set(seedArticles
            .map(article => article.category)
            .filter((category): category is string => category !== null)
        )),
        [seedArticles]
    );

    const filteredArticles = useMemo(() => {
        return seedArticles.filter(articleSeed => (
            selectedCategories.length === 0
            || articleSeed.category === null
            || selectedCategories.includes(articleSeed.category))
            &&
            (activeView === 'all'
                || (activeView === 'offboarded' && !selectedJob.articles.some((a: Article) => a.externalId === articleSeed.externalId))
                || (activeView === 'onboarded' && selectedJob.articles.some((a: Article) => a.externalId === articleSeed.externalId)))
        )
    },
        [seedArticles, selectedCategories, selectedJob, activeView]
    );

    const handleCategoryToggle = useCallback((category: string) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    }, []);

    return {
        seedArticles,
        categories,
        filteredArticles,
        selectedCategories,
        activeView,
        setSelectedCategories,
        setActiveView,
        handleCategoryToggle
    };
};

// Simplified Filter Section Component
const FilterSection = ({
    jobs,
    categories,
    selectedJob,
    selectedCategories,
    onJobSelect,
    onCategoryToggle
}) => (
    <div className="w-1/4 pr-4 border-r overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 sticky top-0 bg-white z-10">Filters</h2>

        <div>
            <h3 className="text-lg font-medium mb-2">Ingestions</h3>
            <ScrollArea className="h-72 rounded-md border">
                <div className="p-2">
                    <h4 className="mb-4 text-sm font-medium leading-none">Ingestions</h4>
                    {jobs.map((job, index) => (
                        <div key={index}>
                            <div
                                className={`text-sm flex items-center space-x-2 cursor-pointer hover:bg-gray-100 ${selectedJob.id === job.id ? 'bg-gray-200' : ''}`}
                                onClick={() => onJobSelect(job)}
                            >
                                {new Intl.DateTimeFormat('fr-FR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }).format(job.createdAt)}

                                <span className="ml-5 bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                                    <svg className="w-2.5 h-2.5 me-1.5" enableBackground="new 0 0 48 48" height="48px" id="Layer_1" version="1.1" viewBox="0 0 48 48" width="48px" >
                                        <path clipRule="evenodd" d="M37,47H11c-2.209,0-4-1.791-4-4V5c0-2.209,1.791-4,4-4h18.973  c0.002,0,0.005,0,0.007,0h0.02H30c0.32,0,0.593,0.161,0.776,0.395l9.829,9.829C40.84,11.407,41,11.68,41,12l0,0v0.021  c0,0.002,0,0.003,0,0.005V43C41,45.209,39.209,47,37,47z M31,4.381V11h6.619L31,4.381z M39,13h-9c-0.553,0-1-0.448-1-1V3H11  C9.896,3,9,3.896,9,5v38c0,1.104,0.896,2,2,2h26c1.104,0,2-0.896,2-2V13z M33,39H15c-0.553,0-1-0.447-1-1c0-0.552,0.447-1,1-1h18  c0.553,0,1,0.448,1,1C34,38.553,33.553,39,33,39z M33,31H15c-0.553,0-1-0.447-1-1c0-0.552,0.447-1,1-1h18c0.553,0,1,0.448,1,1  C34,30.553,33.553,31,33,31z M33,23H15c-0.553,0-1-0.447-1-1c0-0.552,0.447-1,1-1h18c0.553,0,1,0.448,1,1C34,22.553,33.553,23,33,23  z" fillRule="evenodd" />
                                    </svg>
                                    {job.articles.length} onboarded
                                </span>
                                {/* <Badge className="ml-2">{job.articles.length} saved articles</Badge> */}
                            </div>
                            <Separator className="my-2" />
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <h3 className="text-lg font-medium mb-2">Categories</h3>
            {categories.map((category, index) => (
                <label key={index} className="inline-flex items-center mb-2">
                    <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => onCategoryToggle(category)}
                    />
                    <span className="ml-2">{category}</span>
                </label>
            ))}
        </div>
    </div>
);

export default function ArticlesPageClient({ jobs: initialJobs }: { jobs: Job[] }) {
    const { jobs, selectedJob, setSelectedJob, refreshJobs, refreshSelectedJob } = useJobManagement(initialJobs);
    const {
        seedArticles,
        categories,
        filteredArticles,
        selectedCategories,
        activeView,
        setSelectedCategories,
        setActiveView,
        handleCategoryToggle,
    } = useArticleSeedManagement(selectedJob);

    const [article, setArticle] = useState<Article | null>(null);
    const [articleSeed, setArticleSeed] = useState<ArticleSeed | null>(null);
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [isReviewDrawerOpen, setIsReviewDrawerOpen] = useState(false);

    const handleJobSelect = useCallback((job: Job) => {
        console.log('handleJobSelect', job);
        setSelectedJob(job);
        setSelectedCategories([]);
    }, [setSelectedJob, setSelectedCategories]);

    const openReviewDrawer = useCallback((articleSeed: ArticleSeed) => {
        setArticleSeed(articleSeed);
        setIsReviewDrawerOpen(true);
    }, []);

    const openEditDrawer = useCallback((articleSeed: ArticleSeed) => {
        console.log('openEditDrawer');
        setArticleSeed(articleSeed);
        const article = selectedJob.articles.find((a: Article) => a.externalId === articleSeed.externalId);
        if (article) {
            setArticle(article);
            setIsEditDrawerOpen(true);
        }
    }, [selectedJob]);

    const closeDrawers = useCallback(() => {
        setArticle(null);
        setArticleSeed(null);
        setIsReviewDrawerOpen(false);
        setIsEditDrawerOpen(false);
    }, []);

    const offboardArticleSeed = useCallback(async (articleSeed: ArticleSeed) => {
        const article = selectedJob.articles.find((a: Article) => a.externalId === articleSeed.externalId);
        if (article) {
            await deleteArticle(article);
            await refreshJobs();
        }
    }, [selectedJob, refreshJobs]);

    const saveArticleSeed = useCallback(async (articleSeed: ArticleSeed) => {
        const article = selectedJob.articles.find((a: Article) => a.externalId === articleSeed.externalId);

        setArticleSeed(articleSeed);
        if (!article) {
            await persistArticleSeed(articleSeed);
            await refreshJobs();
            setArticle(article);
        }
    }, [selectedJob, refreshJobs]);

    const resetOnboardedArticleToSeed = useCallback(async (article: Article) => {
        const resetedArticle = await resetArticle(article);
        await refreshSelectedJob();
        setArticle(resetedArticle);
    }, [refreshSelectedJob]);

    const updateOnboardedArticle = useCallback(async (article: Article) => {
        const updatedArticle = await updateArticle(article);
        await refreshSelectedJob();
        setArticle(updatedArticle);
    }, [refreshSelectedJob]);

    const refineOnboardedArticle = useCallback(async (article: Article) => {
        const refinedArticle = await refineArticle(article);
        await refreshSelectedJob();
        setArticle(refinedArticle);
    }, [refreshSelectedJob]);

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex h-[calc(100vh-4rem)]">
            <FilterSection
                jobs={jobs}
                categories={categories}
                selectedJob={selectedJob}
                selectedCategories={selectedCategories}
                onJobSelect={handleJobSelect}
                onCategoryToggle={handleCategoryToggle}
            />

            <div className="w-3/4 pl-4 overflow-y-auto">
                <div className="p-2 sticky top-0 bg-white z-10">
                    <h1 className="text-3xl font-bold text-gray-900">Latest Headlines</h1>
                    <ToggleGroup
                        type="single"
                        className="flex justify-center mb-4"
                        value={activeView}
                        onValueChange={(value: 'all' | 'offboarded' | 'onboarded') => setActiveView(value)}
                    >
                        <ToggleGroupItem value="all">All</ToggleGroupItem>
                        <ToggleGroupItem value="offboarded">Offboarded</ToggleGroupItem>
                        <ToggleGroupItem value="onboarded">Onboarded</ToggleGroupItem>
                    </ToggleGroup>
                </div>

                <div className="grid">
                    {filteredArticles.map((articleSeed, index) => (
                        <ArticleSeedCard
                            key={index}
                            article={articleSeed}
                            openReviewDrawer={() => openReviewDrawer(articleSeed)}
                            unsaveArticle={() => offboardArticleSeed(articleSeed)}
                            openEditDrawer={() => openEditDrawer(articleSeed)}
                            isSaved={selectedJob.articles.some((a: Article) => a.externalId === articleSeed.externalId)}
                        />
                    ))}
                </div>
            </div>

            <ArticleReviewDrawer
                article={articleSeed}
                saveArticleSeed={() => saveArticleSeed(articleSeed)}
                isOpen={isReviewDrawerOpen}
                onClose={closeDrawers}
            />

            <ArticleEditDrawer
                article={article}
                offboardArticle={() => offboardArticleSeed(articleSeed)}
                resetArticle={() => resetOnboardedArticleToSeed(article)}
                refineArticle={() => refineOnboardedArticle(article)}
                updateArticle={(articleToUpdate: Article) => updateOnboardedArticle(articleToUpdate)}
                isOpen={isEditDrawerOpen}
                onClose={closeDrawers}
            />
        </main >
    );
}
