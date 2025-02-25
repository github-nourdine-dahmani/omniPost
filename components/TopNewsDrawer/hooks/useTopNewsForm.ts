import { useState } from 'react';
import { TopNews } from '@/types';
import { createArticleSeed } from '@/lib/articleSeeds';

export const useTopNewsForm = (
    topNews: TopNews | null,
    refreshSelectedJob: () => void,
    onClose: () => void,
) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        if (!topNews) return;

        const topNewsToOnboard: TopNews = {
            ...topNews,
            text: formData.get("text")?.toString() || "",
            summary: formData.get("summary")?.toString() || "",
            title: formData.get("title")?.toString() || "",
            url: formData.get("url")?.toString() || "",
        };

        try {
            setIsLoading(true);
            await createArticleSeed(topNewsToOnboard);
            refreshSelectedJob();
            onClose();
        } catch (error) {
            console.error("Error persisting article:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return { handleSubmit, isLoading };
};