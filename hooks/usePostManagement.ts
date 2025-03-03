import { useState, useEffect, useMemo, useCallback } from "react";
import { Transformation, PostPublishStatus, PostTransformationStatus, Post } from "@prisma/client";

export const usePostManagement = (selectedTransformation: Transformation) => {
    const [posts, setPosts] = useState<Post[]>(selectedTransformation.posts || []);
    // const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedPublishStatus, setSelectedPublishStatus] = useState<PostPublishStatus[]>([]);
    const [activeView, setActiveView] = useState<"all" | "discarded" | "queued" | "processing" | "completed" | "failed">("all");

    useEffect(() => {
        setPosts(selectedTransformation.posts || []);
    }, [selectedTransformation]);

    const filteredPosts = useMemo(() => {
        console.log('filteredPosts', selectedPublishStatus);
        return posts.filter(
            (post) =>
                (
                    selectedPublishStatus.length === 0 ||
                    selectedPublishStatus.includes(post.publishStatus)) &&
                (activeView === "all" ||
                    (activeView === "discarded" && post.transformationStatus === PostTransformationStatus.DISCARDED) ||
                    (activeView === "queued" && post.transformationStatus === PostTransformationStatus.QUEUED) ||
                    (activeView === "processing" && post.transformationStatus === PostTransformationStatus.PROCESSING) ||
                    (activeView === "completed" && post.transformationStatus === PostTransformationStatus.COMPLETED) ||
                    (activeView === "failed" && post.transformationStatus === PostTransformationStatus.FAILED))
        );
    }, [posts, activeView, selectedPublishStatus]);

    // const categories = useMemo(
    //     () =>
    //         Array.from(
    //             new Set(
    //                 topNews
    //                     .map((topNews) => topNews.category)
    //                     .filter((category): category is string => category !== null)
    //             )
    //         ),
    //     [topNews]
    // );

    const handlePublishStatusToggle = useCallback((status: PostPublishStatus) => {
        console.log("handlePublishStatusToggle", status);
        console.log(selectedPublishStatus);
        setSelectedPublishStatus((prev) =>
            prev.includes(status)
                ? prev.filter((c) => c !== status)
                : [...prev, status]
        );
    }, [selectedPublishStatus]);

    return {
        posts,
        setPosts,
        // categories,
        filteredPosts,
        // selectedCategories,
        activeView,
        // setSelectedCategories,
        setActiveView,
        selectedPublishStatus,
        // handleCategoryToggle,
        handlePublishStatusToggle
    };
};