"use client";

// import { usePostForm } from './hooks/usePostForm';
import { useEffect, useState } from "react";
import { DrawerOverlay } from './components/DrawerOverlay';
import { DrawerContent } from './components/DrawerContent';
import { PostForm } from './components/PostForm';
import { RawArticleSeed } from '@/types';

import { Transformation, ArticleSeed, Post, PostStatus } from "@prisma/client";
import { getAllTransformations } from '@/lib/transformations';
import { createPost, getPostsByArticleSeed, deletePost, updatePost, updatePostStatus } from '@/lib/posts';
import { getArticleSeed } from '@/lib/articleSeeds';
import { UnplugIcon, EyeIcon, SaveIcon, PenIcon } from "lucide-react";
import { usePostForm } from './hooks/usePostForm';

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PostsTable } from './components/PostsTable';


type PostDrawerProps = {
    articleSeed: RawArticleSeed | null;
    isOpen: boolean;
    onClose: () => void;
};


export default function PostDrawer({
    articleSeed,
    isOpen,
    onClose,
}: PostDrawerProps) {
    const [transformations, setTransformations] = useState<Transformation[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [post, setPost] = useState<Post | null>(null);

    const { handleSubmit, isLoading } = usePostForm(post);

    const fetchTransformations = async () => {
        const collectedTransformations = await getAllTransformations();
        console.log("collectedTransformations", collectedTransformations);
        setTransformations(collectedTransformations);
    };

    const fetchPosts = async () => {
        if (articleSeed?.id) {
            const collectedPosts = await getPostsByArticleSeed(articleSeed.id);
            console.log("collectedPosts", collectedPosts);
            setPosts(collectedPosts);
        }
    };

    useEffect(() => {
        console.log("useEffect/PostDrawer");
        fetchTransformations();
        fetchPosts();
    }, [articleSeed?.id]);

    const handleCloseDrawer = () => {
        setPost(null);
        setPosts([]);
        onClose();
    }

    const handleStatusUpdate = async (post: Post, status: PostStatus) => {
        await updatePostStatus(post, status);
        await fetchPosts();
    };

    const handleDeletePost = async (postId: string) => {
        await deletePost(postId);
        await fetchPosts();
    };

    const handleCreatePost = async (transformation: Transformation) => {
        if (articleSeed) {
            await createPost(articleSeed, transformation);
            await fetchPosts();
        }
    };

    return (
        <div className="relative z-10" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
            <DrawerOverlay isOpen={isOpen} onClose={handleCloseDrawer} />
            <DrawerContent isOpen={isOpen} onClose={handleCloseDrawer}>
                <div className="flex h-screen w-full">
                    <div className="w-1/2 h-full p-4 overflow-y-auto border-r">
                        <PostForm post={post} onSubmit={handleSubmit} isLoading={isLoading} />
                    </div>
                    <div className="w-1/2 h-full p-4 overflow-y-auto">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">Create new Post</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Select Post type</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {transformations.map((transformation) => (
                                    <DropdownMenuItem 
                                        key={transformation.id} 
                                        onClick={() => handleCreatePost(transformation)}
                                    >
                                        {transformation.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <PostsTable 
                            posts={posts}
                            onEditPost={setPost}
                            onStatusUpdate={handleStatusUpdate}
                            onDeletePost={handleDeletePost}
                        />
                    </div>
                </div>
            </DrawerContent>
        </div>
    );
}