'use client';

import React, { useState, useEffect } from 'react';
import { ArticleSeed, Tag, Category, Author } from '@/types';
import { updatePost } from '@/lib/posts';
import { updateArticle, deleteArticle, publishArticle, unPublishArticle } from '@/lib/article';
import { getAllTags, createTagIfNotExists } from '@/lib/tags';
import { getAllCategories, createCategoryIfNotExists } from '@/lib/categories';
import { getAllAuthors } from '@/lib/authors';
import { Combobox } from "@/components/ui/Combobox";
import { Switch } from "@/components/ui/switch";
import { Badge as ShadcnBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useFetchData } from '@/hooks/useFetchData';
import { LinkIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import { persistArticleSeed } from '@/lib/worldnewsapi';
import { Article } from "@prisma/client";
import { useRouter } from 'next/navigation';

type ArticleDrawerProps = {
    article: Article | null;
    isOpen: boolean;
    onClose: () => void;
};

const Badge = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
    <ShadcnBadge variant="outline">{label}<button type="button" onClick={onRemove} className="ml-1.5 text-blue-500 hover:text-blue-700">×</button></ShadcnBadge>
);


export default function ArticleDrawer({ article, isOpen, onClose }: ArticleDrawerProps) {
    const router = useRouter();

    const [tags, setTags] = useState<Tag[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [published, setPublished] = useState(false);
    const { data: availableTags, loading: tagsLoading } = useFetchData(getAllTags);
    const { data: availableCategories, loading: categoriesLoading } = useFetchData(getAllCategories);
    const [isLoading, setIsLoading] = useState(false);

    const close = () => {
        setTags([]);
        setCategory(null);
        setPublished(false);
        onClose();
    };

    const handleTagAdd = async (tagName: string) => {
        setIsLoading(true);
        try {
            const newTag = await createTagIfNotExists(tagName);
            setTags(prevTags => [...prevTags, newTag]);
            if (availableTags && !availableTags.some(t => t.id === newTag.id)) {
                availableTags.push(newTag);
            }
        } catch (error) {
            console.error('Error adding tag:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCategoryAdd = async (categoryName: string) => {
        setIsLoading(true);
        try {
            const newCategory = await createCategoryIfNotExists(categoryName);
            setCategory(newCategory);
            if (availableCategories && !availableCategories.some(t => t.id === newCategory.id)) {
                availableCategories.push(newCategory);
            }
        } catch (error) {
            console.error('Error adding category:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTagRemove = (tagToRemove: Tag) => {
        setTags(prevTags => prevTags.filter(tag => tag.id !== tagToRemove.id));
    };

    const handleDelete = async () => {
        console.log('>>>> handleDelete');
        if (!article) {
            return;
        }

        try {
            await deleteArticle(article);
            router.push('/articles');
        } catch (error) {
            console.error('Error deleting article:', error);
        }
    }

    const handleSubmit = async (formData: FormData) => {
        console.log('>>>> handleSubmit', formData);
        console.log('>>>> handleSubmit', formData);

        // tags.forEach(tag => formData.append('tags[]', tag.id.toString()));
        // formData.append('categoryId', category?.id.toString() || '');
        // formData.append('published', published.toString());

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
            updateArticle(articleToPersist)
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

    // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault(); // Prevent default form submission
    //     const formData = new FormData(event.currentTarget);

    //     setIsLoading(true);
    //     updatePost(formData)
    //         .then(() => {
    //             close();
    //         })
    //         .catch((error) => {
    //             console.error('Error updating post:', error);
    //         })
    //         .finally(() => {
    //             setIsLoading(false);
    //         });
    // };

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
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                            <Textarea id="content" name="content" placeholder="Content" defaultValue={article?.text ?? ''} rows={20} />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="url" className="block text-sm font-medium text-gray-700 cursor-pointer" onClick={() => article?.url && window.open(article.url)}>
                                <span className="inline-block align-middle">
                                    Seed URL <LinkIcon className="h-4 w-4 ml-1 inline-block" />
                                </span>
                            </label>
                            <Input type="text" id="url" name="url" placeholder="Seed URL" defaultValue={article?.url ?? ''} />
                        </div>

                        {/* Author selection */}
                        {/* <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                            {author &&
                                <div className="flex flex-wrap gap-2 mb-2">
                                    <Badge label={author.name} onRemove={() => setAuthor(null)} />
                                </div>}
                            <Combobox
                                items={
                                    availableAuthors
                                        ?.filter(availableAuthor =>
                                            !author || availableAuthor.id !== author.id
                                        )
                                    ?? []
                                }
                                onSelect={setAuthor}
                                getOptionLabel={author => author.name}
                                getOptionValue={author => author.id.toString()}
                                placeholder="Search authors"
                            />
                        </div> */}

                        {/* Tags selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {tags.map(tag => <Badge key={tag.id} label={tag.name} onRemove={() => handleTagRemove(tag)} />)}
                            </div>
                            <Combobox
                                items={
                                    availableTags
                                        ?.filter(availableTag =>
                                            !tags.some(existingTag => existingTag.id === availableTag.id)
                                        )
                                        .map(tag => tag.name)
                                    ?? []
                                }
                                onSelect={handleTagAdd}
                                placeholder="Add a tag..."
                                disabled={isLoading}
                            />
                        </div>

                        {/* Category selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            {category && <div className="flex flex-wrap gap-2 mb-2">
                                <Badge label={category.name} onRemove={() => setCategory(null)} />
                            </div>}
                            <Combobox
                                items={
                                    availableCategories
                                        ?.filter(availableCategory =>
                                            !category || availableCategory.id !== category.id
                                        )
                                    ?? []
                                }
                                onSelect={setCategory}
                                getOptionLabel={category => category.name}
                                getOptionValue={category => category.id.toString()}
                                placeholder="Search categories"
                            />
                        </div>

                        {/* Publish status */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Publish Status</label>
                            <div className="flex items-center">
                                <label className="inline-flex relative items-center mr-5 cursor-pointer">
                                    <Switch checked={published} onCheckedChange={setPublished} />
                                    <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                                        {published ? 'Published' : 'Draft'}
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Form actions */}
                        <div className="sticky bottom-0 left-0 right-0 bg-white p-4 border-t shadow-md flex justify-end space-x-2 z-10">
                            <Button variant="outline" type="button" onClick={close}>Cancel</Button>
                            <Button variant="destructive" type="button" onClick={handleDelete}>Delete Article  <TrashIcon className="h-4 w-4 ml-1 inline-block" /></Button>
                            <Button type="submit">Validate Article <CheckIcon className="h-4 w-4 ml-1 inline-block" /></Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}