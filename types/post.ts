import {Category, Tag, Image, Author} from '@/types';

export default interface Post {
    id: number;
    title: string;
    content: string;
    excerpt?: string;
    slug: string;
    published: boolean;
    author?: Author;
    category?: Category;
    tags: Tag[];
    images: Image[];
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
}

// Utility type for creating a new post
export type CreatePostData = Omit<Post, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
    publishedAt?: Date;
};

// Utility type for updating an existing post
export type UpdatePostData = Partial<CreatePostData>;
