'use client';

import React, { useState, useEffect } from 'react';
import { Post, Tag, Category, Author } from '@/types';
import { updatePost } from '@/lib/posts';
import { getAllTags, createTagIfNotExists } from '@/lib/tags';
import { getAllCategories } from '@/lib/categories';
import { getAllAuthors } from '@/lib/authors';
import { Combobox } from "@/components/ui/Combobox";
import { Switch } from "@/components/ui/switch";
import { Badge as ShadcnBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useFetchData } from '@/hooks/useFetchData';

type PostEditDrawerProps = {
    post: Post;
    isOpen: boolean;
    onClose: () => void;
};

const TagChip = ({ tag, onRemove }: { tag: Tag; onRemove: () => void }) => (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {tag.name}
        <button type="button" onClick={onRemove} className="ml-1.5 text-blue-500 hover:text-blue-700">×</button>
    </span>
);

const Badge = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
    <ShadcnBadge variant="outline">{label}<button type="button" onClick={onRemove} className="ml-1.5 text-blue-500 hover:text-blue-700">×</button></ShadcnBadge>
);


export default function PostEditDrawer({ post, isOpen, onClose }: PostEditDrawerProps) {
    const [tags, setTags] = useState<Tag[]>(post.tags || []);
    const [category, setCategory] = useState<Category | null>(post.category || null);
    const [author, setAuthor] = useState<Author | null>(post.author || null);
    const [published, setPublished] = useState(post.published);
    const { data: availableTags, loading: tagsLoading } = useFetchData(getAllTags);
    const { data: availableCategories, loading: categoriesLoading } = useFetchData(getAllCategories);
    const { data: availableAuthors, loading: authorsLoading } = useFetchData(getAllAuthors);
    const [isLoading, setIsLoading] = useState(false);

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

    const handleTagRemove = (tagToRemove: Tag) => {
        setTags(prevTags => prevTags.filter(tag => tag.id !== tagToRemove.id));
    };

    const handleSubmit = async (formData: FormData) => {
        formData.set('id', post.id.toString());
        tags.forEach(tag => formData.append('tags[]', tag.id.toString()));
        formData.append('authorId', author?.id.toString() || '');
        formData.append('categoryId', category?.id.toString() || '');
        formData.append('published', published.toString());

        try {
            await updatePost(formData);
            onClose();
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    return (
        <div className={`fixed inset-y-0 right-0 z-50 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Edit Post</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                <form action={handleSubmit}>
                    {/* Form fields for title and content */}
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <Input type="text" id="title" name="title" placeholder="Title" defaultValue={post.title} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                        <Textarea id="content" name="content" placeholder="Content" defaultValue={post.content}/>
                    </div>

                    {/* Author selection */}
                    <div className="mb-4">
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
                    </div>

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
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Update Post</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}