'use client';

import React, { useState } from 'react';
import { ArticleSeed } from '@/types';
import { Article } from '@prisma/client';
import { Badge as ShadcnBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { LinkIcon, CheckIcon } from '@heroicons/react/24/outline';

type ArticleSeedDrawerProps = {
    article: ArticleSeed | null;
    isOpen: boolean;
    onClose: () => void;
    saveArticleSeed: (article : ArticleSeed) => Promise<void>;
};

const Badge = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
    <ShadcnBadge variant="outline">{label}<button type="button" onClick={onRemove} className="ml-1.5 text-blue-500 hover:text-blue-700">×</button></ShadcnBadge>
);


export default function ArticlePreviewDrawer({ article, isOpen, onClose, saveArticleSeed }: ArticleSeedDrawerProps) {

    const [isLoading, setIsLoading] = useState(false);

    const close = () => {
        onClose();
    };

    const handleSubmit = async (formData: FormData) => {
        console.log('>>>> handleSubmit', formData);
        console.log('>>>> handleSubmit', article);

        if (!article) {
            return;
        }

        const articleToPersist: ArticleSeed = {
            ...article,
            text: formData.get('text')?.toString() || '',
            summary: formData.get('summary')?.toString() || '',
            title: formData.get('title')?.toString() || '',
            url: formData.get('url')?.toString() || '',
        }

        try {
            // await updatePost(formData);
            setIsLoading(true);
            saveArticleSeed(articleToPersist)
                .then(() => {
                    close();
                })
                .catch((error) => {
                    console.error('Error persisting article:', error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
            close();
        } catch (error) {
            console.error('Error persisting article:', error);
        }
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={close}
                />
            )}
            <div className={`fixed inset-y-0 right-0 z-50 w-[800px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Edit Article Seed</h2>
                        <button onClick={close} className="text-gray-500 hover:text-gray-700">✕</button>
                    </div>
                    <form action={handleSubmit}>
                        <div className="mb-4">
                            {article?.image && (
                                <img src={article.image} alt={article.title} className="w-full h-auto mb-4" />
                            )}
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
                            <Input type="text" id="image" name="image" placeholder="Image URL" defaultValue={article?.image ?? ''} />
                        </div>

                        {/* Form fields for title and content */}
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                            <Input type="text" id="title" name="title" placeholder="Title" defaultValue={article?.title} />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="summary" className="block text-sm font-medium text-gray-700">Summary</label>
                            <Textarea id="summary" name="summary" placeholder="Summary" defaultValue={article?.summary ?? ''} rows={5} />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="text" className="block text-sm font-medium text-gray-700">Text</label>
                            <Textarea id="text" name="text" placeholder="Text" defaultValue={article?.text ?? ''} rows={20} />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="url" className="block text-sm font-medium text-gray-700 cursor-pointer" onClick={() => article?.url && window.open(article.url)}>
                                <span className="inline-block align-middle">
                                    Seed URL <LinkIcon className="h-4 w-4 ml-1 inline-block" />
                                </span>
                            </label>
                            <Input type="text" id="url" name="url" placeholder="Seed URL" defaultValue={article?.url ?? ''} />
                        </div>

                        {/* Form actions */}
                        <div className="sticky bottom-0 left-0 right-0 bg-gray-50 p-4 border-t shadow-md flex justify-end space-x-2 z-10">
                            <Button variant="outline" type="button" onClick={close}>Cancel</Button>
                            <Button type="submit">Save Article <CheckIcon className="h-4 w-4 ml-1 inline-block" /></Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}