import { useState } from 'react';
import { RawArticleSeed } from '@/types';
import { createArticleSeed, editArticleSeed } from '@/lib/articleSeeds';

export const useArticleSeedForm = (
    articleSeed: RawArticleSeed | null,
    refreshSelectedJob: () => void,
    onClose: () => void,
    isSaved: boolean
) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        if (!articleSeed) return;

        const articleSeedToOnboard: RawArticleSeed = {
            ...articleSeed,
            text: formData.get("text")?.toString() || "",
            summary: formData.get("summary")?.toString() || "",
            title: formData.get("title")?.toString() || "",
            url: formData.get("url")?.toString() || "",
        };

        try {
            setIsLoading(true);
            const persistMethod = isSaved ? editArticleSeed : createArticleSeed;

            await persistMethod(articleSeedToOnboard);
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