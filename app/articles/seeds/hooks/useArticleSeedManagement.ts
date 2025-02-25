import { useState, useEffect, useMemo, useCallback } from "react";
import { Job } from "@prisma/client";
import { RawArticleSeed } from "@/types/article";
import { collectRawArticleSeeds } from "@/lib/worldnewsapi";

export const useArticleSeedManagement = (selectedJob: Job) => {
    const [rawArticleSeeds, setRawArticleSeeds] = useState<RawArticleSeed[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [activeView, setActiveView] = useState<"all" | "offboarded" | "onboarded">("all");

    useEffect(() => {
        const fetchRawArticleSeeds = async () => {
            const collectedRawArticleSeeds = await collectRawArticleSeeds(selectedJob);
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
    }, [rawArticleSeeds, selectedCategories, activeView]);

    const categories = useMemo(
        () =>
            Array.from(
                new Set(
                    rawArticleSeeds
                        .map((jobArticleSeed) => jobArticleSeed.category)
                        .filter((category): category is string => category !== null)
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