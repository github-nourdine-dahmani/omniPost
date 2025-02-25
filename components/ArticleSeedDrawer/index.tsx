"use client";

import { useArticleSeedForm } from './hooks/useArticleSeedForm';
import { DrawerOverlay } from './components/DrawerOverlay';
import { DrawerContent } from './components/DrawerContent';
import { ArticleSeedForm } from './components/ArticleSeedForm';
import { RawArticleSeed } from '@/types';

type ArticleSeedDrawerProps = {
    articleSeed: RawArticleSeed | null;
    isOpen: boolean;
    onClose: () => void;
    refreshSelectedJob: () => void;
};

export default function ArticleSeedDrawer({
    articleSeed,
    isOpen,
    onClose,
    refreshSelectedJob,
}: ArticleSeedDrawerProps) {
    const isOnboarded = articleSeed?.id !== null;
    const { handleSubmit, isLoading } = useArticleSeedForm(
        articleSeed,
        refreshSelectedJob,
        onClose,
        isOnboarded
    );

    return (
        <>
            <div className="relative z-10" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
                <DrawerOverlay isOpen={isOpen} onClose={onClose} />
                <DrawerContent isOnboarded={isOnboarded} isOpen={isOpen} onClose={onClose}>
                    <ArticleSeedForm
                        articleSeed={articleSeed}
                        onSubmit={handleSubmit}
                        onClose={onClose}
                        isLoading={isLoading}
                        isOnboarded={isOnboarded}
                    />
                </DrawerContent>
            </div>
        </>
    );
}