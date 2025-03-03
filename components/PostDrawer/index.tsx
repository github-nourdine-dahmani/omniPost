"use client";

import { useEffect, useState } from "react";
import { DrawerOverlay } from './components/DrawerOverlay';
import { DrawerContent } from './components/DrawerContent';
import { PostForm } from './components/PostForm';

import { Transformation, ArticleSeed, Post, PostPublishStatus, PostTransformationStatus } from "@prisma/client";
import { getAllTransformations } from '@/lib/transformations';
import { createPost, deletePost, updatePost, updatePostPublishStatus, updatePostTransformationStatus } from '@/lib/posts';
import { usePostForm } from './hooks/usePostForm';
import { processPost } from "@/lib/transformations";

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
    articleSeed: ArticleSeed | null;
    selectedPost: Post | null;
    isOpen: boolean;
    onClose: () => void;
    refreshParent: () => void;
};


export default function PostDrawer({
    articleSeed,
    selectedPost: selectedPostProp,
    isOpen,
    onClose,
    refreshParent
}: PostDrawerProps) {
    const [transformations, setTransformations] = useState<Transformation[]>([]);
    const [posts, setPosts] = useState<Post[]>(articleSeed?.posts || []);
    const [selectedPost, setSelectedPost] = useState<Post | null>(selectedPostProp || null);

    const { handleSubmit, isLoading } = usePostForm(selectedPost, setPosts);

    const fetchTransformations = async () => {
        const collectedTransformations = await getAllTransformations();
        console.log("collectedTransformations", collectedTransformations);
        setTransformations(collectedTransformations);
    };

    useEffect(() => {
        console.log("useEffect/PostDrawer", articleSeed);
        console.log("useEffect/PostDrawer", articleSeed?.posts);
        isOpen && fetchTransformations();
        isOpen && setPosts(articleSeed?.posts || []);
        isOpen && setSelectedPost(selectedPostProp || null);
    }, [articleSeed?.id, isOpen]);

    const handleCloseDrawer = () => {
        setSelectedPost(null);
        setPosts([]);
        onClose();
    }

    const handlePublishStatusUpdate = async (post: Post, status: PostPublishStatus) => {
        await updatePostPublishStatus(post, status);
        const updatedPost = { ...post, publishStatus: status }
        setPosts(posts.map((p) => p.id === post.id ? updatedPost : p));
        refreshParent();
    };

    const handleTransformationStatusUpdate = async (post: Post, status: PostTransformationStatus) => {
        await updatePostTransformationStatus(post, status);
        const updatedPost = { ...post, transformationStatus: status }
        setPosts(posts.map((p) => p.id === post.id ? updatedPost : p));
        refreshParent();
    };

    const handleDeletePost = async (post: Post) => {
        await deletePost(post);
        setPosts(posts.filter((p) => p.id !== post.id));
        refreshParent();
    };

    const handleCreatePost = async (transformation: Transformation) => {
        if (!articleSeed) return;

        const createdPost = await createPost(articleSeed, transformation);
        setSelectedPost(createdPost);
        setPosts( prev => [...prev, createdPost]);
        refreshParent();
    };

    const handleProcessPostTransformation = async (post: Post) => {
        const processedPost = await processPost(post);
        setPosts(posts.map((p) => p.id === post.id ? processedPost : p));
        setSelectedPost(processedPost);
        refreshParent();
    };

    const handleSelectPost = (post: Post) => {
        console.log("handleSelectPost", post);
        setSelectedPost(post);
    };

    // const handleSubmit2 = (post: Post) => {
    //     console.log("handleSubmit2", post);
    //     handleSubmit();
    //     setSelectedPost(post);
    // };

    return (
        <div className="relative z-10" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
            <DrawerOverlay isOpen={isOpen} onClose={handleCloseDrawer} />
            <DrawerContent isOpen={isOpen} onClose={handleCloseDrawer}>
                <div className="flex h-screen w-full">
                    <div className="w-1/2 h-full p-4 overflow-y-auto border-r">
                        {selectedPost && <PostForm post={selectedPost} onSubmit={handleSubmit} isLoading={isLoading} />}
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
                            posts={posts || []}
                            selectedPost={selectedPost}
                            handleSelectPost={handleSelectPost}
                            onPublishStatusUpdate={handlePublishStatusUpdate}
                            onTransformationStatusUpdate={handleTransformationStatusUpdate}
                            onProcessPostTransformation={handleProcessPostTransformation}
                            onDeletePost={handleDeletePost}
                        />
                    </div>
                </div>
            </DrawerContent>
        </div>
    );
}