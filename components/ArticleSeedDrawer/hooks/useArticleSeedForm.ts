import { useState } from 'react';
import { ArticleSeed } from '@prisma/client';
import { editArticleSeed } from '@/lib/articleSeeds';

export const useArticleSeedForm = (
    articleSeed: ArticleSeed | null,
    refreshParent: () => void,
    onClose: () => void,
) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        if (!articleSeed) return;

        const originalSeedData = JSON.parse(articleSeed.seedData ?? '{}');

        const articleSeedToPersist: ArticleSeed = {
            ...articleSeed,
            seedData: JSON.stringify({
                ...originalSeedData,
                text: formData.get("text")?.toString() || "",
                summary: formData.get("summary")?.toString() || "",
                title: formData.get("title")?.toString() || "",
                url: formData.get("url")?.toString() || "",
            }),
        };

        console.log('>>>> articleSeedToPersist', articleSeedToPersist)

        try {
            setIsLoading(true);
            await editArticleSeed(articleSeedToPersist);
            refreshParent();
            onClose();
        } catch (error) {
            console.error("Error persisting article:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return { handleSubmit, isLoading };
};