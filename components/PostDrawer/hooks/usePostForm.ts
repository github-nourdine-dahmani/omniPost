import { useState } from 'react';
import { Post } from '@prisma/client';
import { updatePost } from '@/lib/posts';

export const usePostForm = (
    post: Post | null,
) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        if (!post) return;

        console.log('>>>> handleSubmit', formData);
        console.log('>>>> handleSubmit', formData.get('title'));

        const postToPersist: Post = {
            ...post,
            title: formData.get('title')?.toString() || '',
            slug: formData.get('slug')?.toString() || '',
            summary: formData.get('summary')?.toString() || '',
            text: formData.get('text')?.toString() || '',
            published: formData.get('published')?.toString() === 'true',
            url: formData.get('url')?.toString() || '',
        }

        console.log('>>>> postToPersist', postToPersist);
        // formData.append('createdAt', yourObject.createdAt?.toISOString() ?? '');
        // formData.append('updatedAt', yourObject.updatedAt?.toISOString() ?? '');
        // formData.append('publishedAt', yourObject.publishedAt?.toISOString() ?? '');

        try {
            setIsLoading(true);
            await updatePost(postToPersist);
        } catch (error) {
            console.error("Error persisting article:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return { handleSubmit, isLoading };
};