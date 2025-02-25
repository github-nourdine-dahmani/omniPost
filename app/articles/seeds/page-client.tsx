"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Article, Job, ArticleSeed } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import ArticleSeedCard from "@/components/ArticleSeedCard";

import ArticleSeedDrawer from "@/components/ArticleSeedDrawer/index";
import { useArticleSeedDrawer } from "@/components/ArticleSeedDrawer/hooks/useArticleSeedDrawer";
import PostDrawer from "@/components/PostDrawer/index";
import { usePostDrawer } from "@/components/PostDrawer/hooks/usePostDrawer";

import { RawArticleSeed } from "@/types/article";
import { collectRawArticleSeeds } from "@/lib/worldnewsapi";
import { deleteArticle } from "@/lib/article";
import { createArticleSeed, deleteArticleSeed } from "@/lib/articleSeeds";
import { getJob } from "@/lib/job";

// Custom hook for managing jobs and selected job
const useJobManagement = (initialJobs: Job[]) => {
    const [jobs, setJobs] = useState(initialJobs);
    const [selectedJob, setSelectedJob] = useState(
        initialJobs.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )[0]
    );

    const refreshSelectedJob = useCallback(async () => {
        console.log("refreshSelectedJob");
        const updatedJob = await getJob(selectedJob.id);

        if (!updatedJob) {
            return;
        }

        setSelectedJob(updatedJob);
        setJobs((prev) =>
            prev.map((job) => (job.id === updatedJob.id ? updatedJob : job))
        );
    }, [selectedJob]);

    return { jobs, selectedJob, setSelectedJob, refreshSelectedJob };
};

// Custom hook for managing article seeds and filtering
const useArticleSeedManagement = (selectedJob: Job) => {
    const [rawArticleSeeds, setRawArticleSeeds] = useState<RawArticleSeed[]>(
        []
    );
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [activeView, setActiveView] = useState<
        "all" | "offboarded" | "onboarded"
    >("all");

    useEffect(() => {
        console.log("useEffect/useArticleSeedManagement");

        const fetchRawArticleSeeds = async () => {
            const collectedRawArticleSeeds = await collectRawArticleSeeds(
                selectedJob
            );
            setRawArticleSeeds(collectedRawArticleSeeds);
        };

        fetchRawArticleSeeds();
        
    }, [selectedJob]);

    const filteredRawArticleSeeds = useMemo(() => {
        return rawArticleSeeds.filter(
            (rawArticleSeed) =>
                (selectedCategories.length === 0 ||
                    rawArticleSeed.category === null ||
                    selectedCategories.includes(rawArticleSeed.category)) &&
                (activeView === "all" ||
                    (activeView === "offboarded" && !rawArticleSeed.id) ||
                    (activeView === "onboarded" && rawArticleSeed.id))
        );
    }, [rawArticleSeeds, selectedCategories, selectedJob, activeView]);

    const categories = useMemo(
        () =>
            Array.from(
                new Set(
                    rawArticleSeeds
                        .map((jobArticleSeed) => jobArticleSeed.category)
                        .filter(
                            (category): category is string => category !== null
                        )
                )
            ),
        [rawArticleSeeds]
    );

    const handleCategoryToggle = useCallback((category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    }, []);

    return {
        rawArticleSeeds,
        categories,
        filteredRawArticleSeeds,
        selectedCategories,
        activeView,
        setSelectedCategories,
        setActiveView,
        handleCategoryToggle,
    };
};

// Simplified Filter Section Component
const FilterSection = ({
    jobs,
    categories,
    selectedJob,
    selectedCategories,
    onJobSelect,
    onCategoryToggle,
}) => (
    <div className="w-1/4 pr-4 border-r overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 sticky top-0 bg-white z-10">
            Filters
        </h2>

        <div>
            <h3 className="text-lg font-medium mb-2">Ingestions</h3>
            <ScrollArea className="h-72 rounded-md border">
                <div className="p-2">
                    <h4 className="mb-4 text-sm font-medium leading-none">
                        Ingestions
                    </h4>
                    {jobs.map((job, index) => (
                        <div key={index}>
                            <div
                                className={`text-sm flex items-center space-x-2 cursor-pointer hover:bg-gray-100 ${selectedJob.id === job.id
                                        ? "bg-gray-200"
                                        : ""
                                    }`}
                                onClick={() => onJobSelect(job)}
                            >
                                {new Intl.DateTimeFormat("fr-FR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                }).format(job.createdAt)}

                                <span className="ml-5 bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                                    <svg
                                        className="w-2.5 h-2.5 me-1.5"
                                        enableBackground="new 0 0 48 48"
                                        height="48px"
                                        id="Layer_1"
                                        version="1.1"
                                        viewBox="0 0 48 48"
                                        width="48px"
                                    >
                                        <path
                                            clipRule="evenodd"
                                            d="M37,47H11c-2.209,0-4-1.791-4-4V5c0-2.209,1.791-4,4-4h18.973  c0.002,0,0.005,0,0.007,0h0.02H30c0.32,0,0.593,0.161,0.776,0.395l9.829,9.829C40.84,11.407,41,11.68,41,12l0,0v0.021  c0,0.002,0,0.003,0,0.005V43C41,45.209,39.209,47,37,47z M31,4.381V11h6.619L31,4.381z M39,13h-9c-0.553,0-1-0.448-1-1V3H11  C9.896,3,9,3.896,9,5v38c0,1.104,0.896,2,2,2h26c1.104,0,2-0.896,2-2V13z M33,39H15c-0.553,0-1-0.447-1-1c0-0.552,0.447-1,1-1h18  c0.553,0,1,0.448,1,1C34,38.553,33.553,39,33,39z M33,31H15c-0.553,0-1-0.447-1-1c0-0.552,0.447-1,1-1h18c0.553,0,1,0.448,1,1  C34,30.553,33.553,31,33,31z M33,23H15c-0.553,0-1-0.447-1-1c0-0.552,0.447-1,1-1h18c0.553,0,1,0.448,1,1C34,22.553,33.553,23,33,23  z"
                                            fillRule="evenodd"
                                        />
                                    </svg>
                                    {job.articleSeeds.length} onboarded
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

export default function ArticlesPageClient({
    jobs: initialJobs,
}: {
    jobs: Job[];
}) {
    const { jobs, selectedJob, setSelectedJob, refreshSelectedJob } =
        useJobManagement(initialJobs);
    const {
        rawArticleSeeds,
        categories,
        filteredRawArticleSeeds,
        selectedCategories,
        activeView,
        setSelectedCategories,
        setActiveView,
        handleCategoryToggle,
    } = useArticleSeedManagement(selectedJob);

    const [selectedRawArticleSeed, setSelectedRawArticleSeed] =
        useState<RawArticleSeed | null>(null);

    const handleJobSelect = useCallback(
        (job: Job) => {
            console.log("handleJobSelect", job);
            setSelectedJob(job);
            setSelectedCategories([]);
        },
        [setSelectedJob, setSelectedCategories]
    );

    const offboardArticleSeed = useCallback(
        async (jobArticleSeed: RawArticleSeed) => {
            console.log("offboardArticleSeed", jobArticleSeed);

            await deleteArticleSeed(jobArticleSeed);
            await refreshSelectedJob();
        },
        [selectedJob]
    );

    const { isOpen: isArticleSeedDrawerOpen, openDrawer: openArticleSeedDrawer, closeDrawer: closeArticleSeedDrawer } = useArticleSeedDrawer()
    const { isOpen: isPostDrawerOpen, openDrawer: openPostDrawer, closeDrawer: closePostDrawer } = usePostDrawer()

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
                    <h1 className="text-3xl font-bold text-gray-900">
                        Latest Headlines
                    </h1>
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
                    {filteredRawArticleSeeds.map((rawArticleSeed, index) => {
                        // console.log(">>>> rawArticleSeed", rawArticleSeed);
                        
                        return (
                            <ArticleSeedCard
                                key={index}
                                articleSeed={rawArticleSeed}
                                openArticleSeedDrawer={() => {
                                    setSelectedRawArticleSeed(rawArticleSeed);
                                    openArticleSeedDrawer();
                                }}
                                openPostDrawer={() => {
                                    setSelectedRawArticleSeed(rawArticleSeed);
                                    openPostDrawer();
                                }}
                                offboardArticleSeed={() =>
                                    offboardArticleSeed(rawArticleSeed)
                                }
                            />
                        );
                    })}
                </div>
            </div>

            <ArticleSeedDrawer
                articleSeed={selectedRawArticleSeed}
                isOpen={isArticleSeedDrawerOpen}
                onClose={closeArticleSeedDrawer}
                refreshSelectedJob={() => refreshSelectedJob()}
            />

            <PostDrawer
                articleSeed={selectedRawArticleSeed}
                isOpen={isPostDrawerOpen}
                onClose={closePostDrawer}
            />

        </main>
    );
}
