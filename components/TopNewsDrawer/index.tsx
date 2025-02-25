"use client";

import { useTopNewsForm } from './hooks/useTopNewsForm';
import { DrawerOverlay } from './components/DrawerOverlay';
import { DrawerContent } from './components/DrawerContent';
import { TopNewsForm } from './components/TopNewsForm';
import { TopNews } from '@/types';

type TopNewsDrawerProps = {
    topNews: TopNews | null;
    isOpen: boolean;
    onClose: () => void;
    refreshSelectedJob: () => void;
};

export default function TopNewsDrawer({
    topNews,
    isOpen,
    onClose,
    refreshSelectedJob,
}: TopNewsDrawerProps) {
    const { handleSubmit, isLoading } = useTopNewsForm(
        topNews,
        refreshSelectedJob,
        onClose,
    );

    return (
        <>
            <div className="relative z-10" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
                <DrawerOverlay isOpen={isOpen} onClose={onClose} />
                <DrawerContent isOpen={isOpen} onClose={onClose}>
                    {topNews && <TopNewsForm
                        topNews={topNews}
                        onSubmit={handleSubmit}
                        onClose={onClose}
                        isLoading={isLoading}
                    />}
                </DrawerContent>
            </div>
        </>
    );
}