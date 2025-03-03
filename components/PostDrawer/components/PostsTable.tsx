import { Post, PostPublishStatus, PostTransformationStatus } from "@prisma/client";
import { PostActionButtons } from "./PostActionButtons";

interface PostsTableProps {
    posts: Post[];
    selectedPost: Post | null;
    handleSelectPost: (post: Post) => void;
    onPublishStatusUpdate: (post: Post, status: PostPublishStatus) => void;
    onTransformationStatusUpdate: (post: Post, status: PostTransformationStatus) => void;
    onDeletePost: (post: Post) => Promise<void>;
    onProcessPostTransformation: (post: Post) => Promise<void>;
}

export function PostsTable({ posts, selectedPost, handleSelectPost, onPublishStatusUpdate, onTransformationStatusUpdate, onDeletePost, onProcessPostTransformation }: PostsTableProps) {
    return (
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">Transformation</th>
                    <th scope="col" className="px-6 py-3">Publish Status</th>
                    <th scope="col" className="px-6 py-3">Transformation Status</th>
                    <th scope="col" className="px-6 py-3">Action</th>
                </tr>
            </thead>
            <tbody>
                {posts?.map((post) => (
                    <tr key={post.id} className={` border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 ${post.id === selectedPost?.id ? "bg-gray-200 dark:bg-gray-700" : ""}`}>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {post?.transformation?.name}
                        </th>
                        <td className="px-6 py-4">{post.publishStatus}</td>
                        <td className="px-6 py-4">{post.transformationStatus}</td>
                        <td className="px-6 py-4">
                            <PostActionButtons 
                                post={post}
                                handleSelectPost={handleSelectPost}
                                onPublishStatusUpdate={onPublishStatusUpdate}
                                onTransformationStatusUpdate={onTransformationStatusUpdate}
                                onDelete={onDeletePost}
                                onProcessPostTransformation={onProcessPostTransformation}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}