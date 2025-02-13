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
import ArticlePreviewDrawer from "@/components/ArticlePreviewDrawer";

import { ArticleSeed } from "@/types/article";
import { collectTopNews, persistArticleSeed } from "@/lib/worldnewsapi";
import { deleteArticle } from "@/lib/article";
import { getAllJobs } from "@/lib/job";

// Custom hook for managing jobs and selected job
const useJobManagement = (initialJobs: Job[]) => {

    
    const [jobs, setJobs] = useState(initialJobs);
    const [selectedJob, setSelectedJob] = useState(
        initialJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    );

    console.log("useJobManagement", selectedJob)

    const refreshJobs = useCallback(async () => {
        console.log('refreshJobs');
        const updatedJobs = await getAllJobs(JobType.FETCH_TOP_NEWS);
        setJobs(updatedJobs);

        const previouslySelectedJob = updatedJobs.find(job => job.id === selectedJob.id);
        const newSelectedJob = previouslySelectedJob ||
            updatedJobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        setSelectedJob(newSelectedJob);
    }, [selectedJob]);

    return { jobs, selectedJob, setSelectedJob, refreshJobs };
};

// Custom hook for managing article seeds and filtering
const useArticleSeedManagement = (selectedJob: Job) => {
    const [seedArticles, setSeedArticles] = useState<ArticleSeed[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [activeView, setActiveView] = useState<'all' | 'saved'>('all');

    useEffect(() => {
        console.log('useEffect selectedJob', selectedJob);
        const fetchAndProcessArticles = async () => {
            const fetchedSeedArticles = await collectTopNews(selectedJob);
            console.log('useEffect fetchAndProcessArticles', fetchedSeedArticles);
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

        console.log('filteredArticles', selectedCategories)
        console.log('filteredArticles', selectedCategories.length)
        return seedArticles.filter(articleSeed =>
            (
                selectedCategories.length === 0 ||
                articleSeed.category === null ||
                selectedCategories.includes(articleSeed.category)
            ) 
                && (activeView === 'all' || selectedJob.articles.some((a: Article) => a.externalId === articleSeed.externalId))
        )},
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
                                <Badge className="ml-2">{job.articles.length} Saved articles</Badge>
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
    const { jobs, selectedJob, setSelectedJob, refreshJobs } = useJobManagement(initialJobs);
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
    const [isPreviewDrawerOpen, setIsPreviewDrawerOpen] = useState(false);

    const handleJobSelect = useCallback((job: Job) => {
        console.log('handleJobSelect', job);
        setSelectedJob(job);
        setSelectedCategories([]);
    }, [setSelectedJob, setSelectedCategories]);

    const openPreviewDrawer = useCallback((articleSeed: ArticleSeed) => {
        setArticleSeed(articleSeed);
        setIsPreviewDrawerOpen(true);
    }, []);

    const openEditDrawer = useCallback((articleSeed: ArticleSeed) => {
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
        setIsPreviewDrawerOpen(false);
        setIsEditDrawerOpen(false);
    }, []);

    const unsaveArticleSeed = useCallback(async (articleSeed: ArticleSeed) => {
        const article = selectedJob.articles.find((a: Article) => a.externalId === articleSeed.externalId);
        if (article) {
            await deleteArticle(article);
            await refreshJobs();
        }
    }, [selectedJob, refreshJobs]);

    const saveArticleSeed = useCallback(async (articleSeed: ArticleSeed) => {
        const article = selectedJob.articles.find((a: Article) => a.externalId === articleSeed.externalId);

        if (!article) {
            await persistArticleSeed(articleSeed);
            await refreshJobs();
        }
    }, [selectedJob, refreshJobs]);

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
                <div className="mb-8 sticky top-0 bg-white z-10">
                    <h1 className="text-3xl font-bold text-gray-900">Latest Headlines</h1>
                    <ToggleGroup
                        type="single"
                        className="flex justify-center mb-4"
                        value={activeView}
                        onValueChange={(value: 'all' | 'saved') => setActiveView(value)}
                    >
                        <ToggleGroupItem value="all">All</ToggleGroupItem>
                        <ToggleGroupItem value="saved">Saved</ToggleGroupItem>
                    </ToggleGroup>
                </div>

                <div className="grid">
                    {filteredArticles.map((articleSeed, index) => (
                        <ArticleSeedCard
                            key={index}
                            article={articleSeed}
                            openPreviewDrawer={() => openPreviewDrawer(articleSeed)}
                            unsaveArticle={() => unsaveArticleSeed(articleSeed)}
                            openEditDrawer={() => openEditDrawer(articleSeed)}
                            isSaved={selectedJob.articles.some((a: Article) => a.externalId === articleSeed.externalId)}
                        />
                    ))}
                </div>
            </div>

            <ArticlePreviewDrawer
                article={articleSeed}
                saveArticleSeed={() => saveArticleSeed(articleSeed)}
                isOpen={isPreviewDrawerOpen}
                onClose={closeDrawers}
            />

            <ArticleEditDrawer
                article={article}
                unsaveArticle={() => unsaveArticleSeed(articleSeed)}
                isOpen={isEditDrawerOpen}
                onClose={closeDrawers}
            />
        </main>
    );
}
