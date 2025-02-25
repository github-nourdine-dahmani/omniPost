'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Article } from '@prisma/client';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getRefineArticle, updateArticle } from "@/lib/article"
import { TextProcessingType } from '@/types/textProcessing';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CloudArrowDownIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { CircleArrowUp, UnplugIcon } from 'lucide-react';
import { processText } from '@/lib/textProcessing';

type ArticleEditDrawerProps = {
    article: Article | null;
    isOpen: boolean;
    onClose: () => void;
    refreshSelectedJob: () => void;
    offboardArticle: () => void;
};

type ArticleFormData = {
    title: string;
    text: string;
    summary: string;
    url: string;
    image: string;
};

export default function ArticleEditDrawer({
    article,
    isOpen,
    onClose,
    offboardArticle,
    refreshSelectedJob
}: ArticleEditDrawerProps) {
    const [formData, setFormData] = useState<ArticleFormData>({
        title: '',
        text: '',
        summary: '',
        url: '',
        image: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [activeView, setActiveView] = useState<'article' | 'seed'>('article');

    const resetFormData = useCallback((sourceData: Partial<Article>) => {
        setFormData({
            title: sourceData.title || '',
            text: sourceData.text || '',
            summary: sourceData.summary || '',
            url: sourceData.url || '',
            image: sourceData.image || '',
        });
    }, []);

    useEffect(() => {
        if (article) {
            resetFormData(article);
        }
    }, [article, resetFormData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!article) return;

        try {
            setIsLoading(true);
            const updatedArticle: Article = {
                ...article,
                ...formData
            };

            await updateArticle(updatedArticle);
            refreshSelectedJob();
            onClose();
        } catch (error) {
            console.error('Error updating article:', error);
            // TODO: Add user-friendly error notification
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetToSeed = () => {
        if (article?.seedData) {
            try {
                const seedData = JSON.parse(article?.seedData ?? '{}');
                resetFormData(seedData);
            } catch (error) {
                console.error('Error parsing seed data:', error);
                // TODO: Add user-friendly error notification
            }
        }
    };

    const handleRefine = async () => {
        if (article?.seedData) {
            try {


                // const refinedArticle = getRefineArticle(article)

                // console.log(refinedArticle)
                const seedData = JSON.parse(article?.seedData ?? '{}');

                // const processedText = processText(seedData.text, TextProcessingType.SUMMARIZE_3P);
                // const refinedArticle = {...article, text: data}    
                // resetFormData(refinedArticle)

                processText(seedData.title, TextProcessingType.REWRITE).then(data => {
                    setFormData( prev => ({
                        ...prev,
                        title: data.data ?? '',
                    }));
                });
                processText(seedData.text, TextProcessingType.SUMMARIZE_3P).then(data => {
                    setFormData( prev => ({
                        ...prev,
                        text: data.data ?? '',
                    }));
                });
                processText(seedData.text, TextProcessingType.SUMMARIZE_1P).then(data => {
                    setFormData( prev => ({
                        ...prev,
                        summary: data.data ?? '',
                    }));
                });

            } catch (error) {
                console.error('Error refining article:', error);
                // TODO: Add user-friendly error notification
            }
        }
    };

    // if (!isOpen) return null;

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={onClose}
                />
            )}
            <div className={`fixed inset-y-0 right-0 z-50 w-[800px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6">
                    <div className="p-2 sticky top-0 bg-white z-10">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Edit Article</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>

                        <ToggleGroup
                            type="single"
                            className="flex justify-center mb-4"
                            value={activeView}
                            onValueChange={(value: 'article' | 'seed') => setActiveView(value)}
                        >
                            <ToggleGroupItem value="article">Article</ToggleGroupItem>
                            <ToggleGroupItem value="seed">Seed</ToggleGroupItem>
                        </ToggleGroup>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {formData.image && (
                            <img
                                src={formData.image}
                                alt={formData.title}
                                className="w-full h-auto mb-4"
                            />
                        )}

                        <div className="space-y-4">
                            <Input
                                name="image"
                                placeholder="Image URL"
                                value={formData.image}
                                onChange={handleInputChange}
                                disabled={isLoading}
                            />
                            <Input
                                name="title"
                                placeholder="Title"
                                value={formData.title}
                                onChange={handleInputChange}
                                disabled={isLoading}
                            />
                            <Textarea
                                name="summary"
                                placeholder="Summary"
                                value={formData.summary}
                                onChange={handleInputChange}
                                disabled={isLoading}
                            />
                            <Textarea
                                name="text"
                                placeholder="Article Text"
                                value={formData.text}
                                onChange={handleInputChange}
                                disabled={isLoading}
                                rows={8}
                            />
                            <Input
                                name="url"
                                placeholder="URL"
                                value={formData.url}
                                onChange={handleInputChange}
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex justify-between items-center mt-4">
                            <div className="flex">
                                <button
                                    type="button"
                                    onClick={() => { offboardArticle(); onClose(); }}
                                    className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
                                >
                                    <span className="relative text-xs px-3 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                        Offboard <UnplugIcon className="h-4 w-4 ml-1 inline-block" />
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleResetToSeed}
                                    className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                                >
                                    <span className="relative text-xs px-3 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                        Reset <CloudArrowDownIcon className="h-4 w-4 ml-1 inline-block" />
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRefine}
                                    className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                                >
                                    <span className="relative text-xs px-3 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                        Refine <SparklesIcon className="h-4 w-4 ml-1 inline-block" />
                                    </span>
                                </button>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800"
                                >
                                    <span className="relative text-xs px-3 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                        Cancel
                                    </span>
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                                >
                                    <span className="relative text-xs px-3 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                        Save
                                    </span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}