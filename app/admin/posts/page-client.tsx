"use client";
import { useState, useCallback } from "react";
import { Transformation, ArticleSeed, Post, PostStatus } from "@prisma/client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import PostCard from "@/components/PostCard";
import PostDrawer from "@/components/PostDrawer";
import { usePostDrawer } from "@/components/PostDrawer/hooks/usePostDrawer";
import { PostsFilterSection } from "@/components/PostsFilterSection";
import { useTransformationManagement } from "@/hooks/useTransformationManagement";
import { usePostManagement } from "@/hooks/usePostManagement";

export default function TransformationsPageClient({ transformations: initialTransformations }: { transformations: Transformation[] }) {
    
    const { transformations, selectedTransformation, setSelectedTransformation, refreshSelectedTransformation } = useTransformationManagement(initialTransformations);



    const {
        filteredPosts,
        activeView,
        setActiveView,
        // handleCategoryToggle,
        selectedPublishStatus,
        handlePublishStatusToggle
    } = usePostManagement(selectedTransformation);

    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const { isOpen: isPostDrawerOpen, openDrawer: openPostDrawer, closeDrawer: closePostDrawer } = usePostDrawer();

    const handleTransformationSelect = useCallback((transformation: Transformation) => {
        setSelectedTransformation(transformation);
        // setSelectedCategories([]);
    }, [setSelectedTransformation]);

    // const offboardArticleSeed = useCallback(async (articleSeed: ArticleSeed) => {
    //     await deleteArticleSeed(articleSeed);
    //     await refreshSelectedJob();
    // }, [refreshSelectedJob]);

    return (
        <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex h-[calc(100vh-4rem)]">
            <PostsFilterSection
                transformations={transformations}
                selectedTransformation={selectedTransformation}
                onTransformationSelect={handleTransformationSelect}
                onPublishStatusToggle={handlePublishStatusToggle}
                selectedPublishStatus={selectedPublishStatus}
            />

            <div className="w-3/4 pl-4 overflow-y-auto">
                <div className="p-2 sticky top-0 bg-white z-10">
                    <ToggleGroup
                        type="single"
                        className="flex justify-center mb-4"
                        value={activeView}
                        onValueChange={(
                            value: "all" | "discarded" | "queued" | "processing" | "completed" | "failed"     
                        ) => setActiveView(value)}
                    >
                        <ToggleGroupItem value="all">All</ToggleGroupItem>
                        <ToggleGroupItem value="discarded">
                            Discarded
                        </ToggleGroupItem>
                        <ToggleGroupItem value="queued">
                            Queued
                        </ToggleGroupItem>
                        <ToggleGroupItem value="processing">
                            Processing
                        </ToggleGroupItem>
                        <ToggleGroupItem value="completed">
                            Completed
                        </ToggleGroupItem>
                        <ToggleGroupItem value="failed">
                            Failed
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>

                <div className="grid">
                    {filteredPosts.map((post, index) => {
                        // console.log(">>>> post", post);
                        // console.log(">>>> post?.asrticleSeed", post?.articleSeed);
                        return (
                                <PostCard
                                    key={index}
                                    post={post}
                                    openPostDrawer={() => {
                                        console.log("post", post)
                                        setSelectedPost(post);
                                        openPostDrawer();
                                    }}
                                />
                        );
                    })}
                </div>
            </div>
            
            <PostDrawer
                articleSeed={selectedPost?.articleSeed}
                selectedPost={selectedPost}
                isOpen={isPostDrawerOpen}
                onClose={closePostDrawer}
                refreshParent={refreshSelectedTransformation}
            />

        </main>
    );
}
