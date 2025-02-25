import { useState, useEffect, useMemo, useCallback } from "react";
import { Transformation, PostStatus, Post } from "@prisma/client";

export const usePostManagement = (selectedTransformation: Transformation) => {
    const [posts, setPosts] = useState<Post[]>(selectedTransformation.posts || []);
    // const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [activeView, setActiveView] = useState<"all" | "draft" | "queued" | "published">("all");

    useEffect(() => {
        setPosts(selectedTransformation.posts || []);
    }, [selectedTransformation]);

    const filteredPosts = useMemo(() => {
        return posts.filter(
            (post) =>
                // (selectedCategories.length === 0 ||
                //     post.category === null ||
                //     selectedCategories.includes(post.category)) &&
                (activeView === "all" ||
                    (activeView === "draft" && post.status === PostStatus.DRAFT) ||
                    (activeView === "queued" && post.status === PostStatus.QUEUED) ||
                    (activeView === "published" && post.status === PostStatus.PUBLISHED))
        );
    }, [posts, activeView]);

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

    // const handleCategoryToggle = useCallback((category: string) => {
    //     setSelectedCategories((prev) =>
    //         prev.includes(category)
    //             ? prev.filter((c) => c !== category)
    //             : [...prev, category]
    //     );
    // }, []);

    return {
        posts,
        // categories,
        filteredPosts,
        // selectedCategories,
        activeView,
        // setSelectedCategories,
        setActiveView,
        // handleCategoryToggle,
    };
};