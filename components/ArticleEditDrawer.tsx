'use client';

import React, { useState } from 'react';
import { Article } from '@prisma/client';
import { Badge as ShadcnBadge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LinkIcon, CheckIcon, TrashIcon, CloudArrowDownIcon, SparklesIcon } from '@heroicons/react/24/outline';


type ArticleEditDrawerProps = {
    article: Article | null;
    isOpen: boolean;
    onClose: () => void;
    offboardArticle: () => void;
    resetArticle: () => void;
    updateArticle: (articleToUpdate: Article) => void;
    refineArticle: (articleToRefine: Article) => void;
};

const Badge = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
    <ShadcnBadge variant="outline">{label}<button type="button" onClick={onRemove} className="ml-1.5 text-blue-500 hover:text-blue-700">×</button></ShadcnBadge>
);


export default function ArticleEditDrawer({ article, isOpen, onClose, offboardArticle, resetArticle, updateArticle, refineArticle }: ArticleEditDrawerProps) {

    const [isLoading, setIsLoading] = useState(false);
    const [activeView, setActiveView] = useState<'article' | 'seed'>('article');

    const close = () => {
        onClose();
    };

    const getActiveArticle = () => {
        if (activeView === 'article') {
            return article
        } else {
            return article?.seedData ? JSON.parse(article.seedData) : null;
        }
    }

    const handleSubmit = async (formData: FormData) => {
        console.log('>>>> handleSubmit', formData);
        console.log('>>>> handleSubmit', article);

        if (!article) {
            return;
        }

        const articleToPersist: Article = {
            ...article,
            text: formData.get('text')?.toString() || '',
            summary: formData.get('summary')?.toString() || '',
            title: formData.get('title')?.toString() || '',
            url: formData.get('url')?.toString() || '',
        }

        try {
            // await updatePost(formData);
            setIsLoading(true);
            updateArticle(articleToPersist);
            setIsLoading(false);
            close();
        } catch (error) {
            console.error('Error updating article:', error);
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

                    <div className="p-2 sticky top-0 bg-white z-10">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Edit Article Seed</h2>
                            <button onClick={close} className="text-gray-500 hover:text-gray-700">✕</button>


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

                    <form action={handleSubmit}>
                        <div className="mb-4">
                            {getActiveArticle()?.image && (
                                <img src={getActiveArticle().image} alt={getActiveArticle().title} className="w-full h-auto mb-4" />
                            )}
                            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
                            <Input type="text" id="image" name="image" placeholder="Image URL" defaultValue={getActiveArticle()?.image ?? ''} />
                        </div>

                        {/* Form fields for title and content */}
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                            <Input type="text" id="title" name="title" placeholder="Title" defaultValue={getActiveArticle()?.title} />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="summary" className="block text-sm font-medium text-gray-700">Summary</label>
                            <Textarea id="summary" name="summary" placeholder="Summary" defaultValue={getActiveArticle()?.summary ?? ''} rows={5} />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="text" className="block text-sm font-medium text-gray-700">Text</label>
                            <Textarea id="text" name="text" placeholder="Text" defaultValue={getActiveArticle()?.text ?? ''} rows={20} />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="url" className="block text-sm font-medium text-gray-700 cursor-pointer" onClick={() => getActiveArticle()?.url && window.open(getActiveArticle().url)}>
                                <span className="inline-block align-middle">
                                    Seed URL <LinkIcon className="h-4 w-4 ml-1 inline-block" />
                                </span>
                            </label>
                            <Input type="text" id="url" name="url" placeholder="Seed URL" defaultValue={getActiveArticle()?.url ?? ''} />
                        </div>

                        {/* Form actions */}

                        {activeView === 'article' && (
                            <div className="sticky bottom-0 left-0 right-0 bg-gray-50 p-4 border-t shadow-md flex justify-end space-x-2 z-10">
                                {/* <Button variant="outline" type="button" onClick={close}>Cancel</Button> */}
                                {/* <Button className="flex items-center bg-red-500 hover:bg-red-600 text-white hover:text-white" type="button" onClick={() => { offboardArticle(); close(); }}>Exclude Article <TrashIcon className="h-4 w-4 ml-1 inline-block" /></Button> */}
                                {/* <Button  type="submit">Save <CheckIcon className="h-4 w-4 ml-1 inline-block" /></Button> */}

                                <button type="button" onClick={close} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800">
                                    <span className="relative text-xs px-3 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                        Cancel
                                    </span>
                                </button>
                                <button type="button" onClick={() => { offboardArticle(); close(); }} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
                                    <span className="relative text-xs px-3 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                        Offboard <TrashIcon className="h-4 w-4 ml-1 inline-block" />
                                    </span>
                                </button>
                                <button type="button" onClick={() => { resetArticle(article); }} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
                                    <span className="relative text-xs px-3 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                        Reset <CloudArrowDownIcon className="h-4 w-4 ml-1 inline-block" />
                                    </span>
                                </button>

                                <button type="button" onClick={() => { refineArticle(article); }} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                                    <span className="relative text-xs px-3 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                        Refine <SparklesIcon className="h-4 w-4 ml-1 inline-block" />
                                    </span>
                                </button>
                                <button type="submit" className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                                    <span className="relative text-xs px-3 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                        Save <CheckIcon className="h-4 w-4 ml-1 inline-block" />
                                    </span>
                                </button>
                            </div>

                        )}
                    </form>
                </div>
            </div>
        </>
    );
}