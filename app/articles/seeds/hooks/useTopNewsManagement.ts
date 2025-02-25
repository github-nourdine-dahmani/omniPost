import { useState, useEffect, useMemo, useCallback } from "react";
import { Job } from "@prisma/client";
import { TopNews } from "@/types/topNews";
import { collectTopNews } from "@/lib/worldnewsapi";

export const useTopNewsManagement = (selectedJob: Job) => {
    const [topNews, setTopNews] = useState<TopNews[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [activeView, setActiveView] = useState<"all" | "offboarded" | "onboarded">("all");

    useEffect(() => {
        const fetchTopNews = async () => {
            const collectedTopNews = await collectTopNews(selectedJob);
            setTopNews(collectedTopNews);
        };
        fetchTopNews();
    }, [selectedJob]);

    const filteredTopNews = useMemo(() => {
        return topNews.filter(
            (topNews) =>
                (selectedCategories.length === 0 ||
                    topNews.category === null ||
                    selectedCategories.includes(topNews.category)) &&
                (activeView === "all" ||
                    (activeView === "offboarded" && !topNews.articleSeed) ||
                    (activeView === "onboarded" && topNews.articleSeed))
        );
    }, [topNews, selectedCategories, activeView]);

    const categories = useMemo(
        () =>
            Array.from(
                new Set(
                    topNews
                        .map((topNews) => topNews.category)
                        .filter((category): category is string => category !== null)
                )
            ),
        [topNews]
    );

    const handleCategoryToggle = useCallback((category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    }, []);

    return {
        topNews,
        categories,
        filteredTopNews,
        selectedCategories,
        activeView,
        setSelectedCategories,
        setActiveView,
        handleCategoryToggle,
    };
};