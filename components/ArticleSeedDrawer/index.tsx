"use client";

import { useArticleSeedForm } from './hooks/useArticleSeedForm';
import { DrawerOverlay } from './components/DrawerOverlay';
import { DrawerContent } from './components/DrawerContent';
import { ArticleSeedForm } from './components/ArticleSeedForm';
import { ArticleSeed } from '@prisma/client';
import { TopNews } from '@/types';

type ArticleSeedDrawerProps = {
    articleSeed: ArticleSeed | null;
    topNews: TopNews | null;
    isOpen: boolean;
    onClose: () => void;
    refreshSelectedJob: () => void;
};

export default function ArticleSeedDrawer({
    articleSeed,
    topNews,
    isOpen,
    onClose,
    refreshSelectedJob,
}: ArticleSeedDrawerProps) {
    const { handleSubmit, isLoading } = useArticleSeedForm(
        articleSeed,
        refreshSelectedJob,
        onClose
    );

    return (
        <>
            <div className="relative z-10" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
                <DrawerOverlay isOpen={isOpen} onClose={onClose} />
                <DrawerContent isOpen={isOpen} onClose={onClose}>
                    {articleSeed && (
                        <ArticleSeedForm
                            articleSeed={articleSeed}
                            topNews={topNews}
                            onSubmit={handleSubmit}
                            onClose={onClose}
                            isLoading={isLoading}
                        />
                    )}
                </DrawerContent>
            </div>
        </>
    );
}