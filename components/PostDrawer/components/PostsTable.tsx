import { Post, PostStatus } from "@prisma/client";
import { PostActionButtons } from "./PostActionButtons";

interface PostsTableProps {
    posts: Post[];
    selectedPost: Post | null;
    handleSelectPost: (post: Post) => void;
    onStatusUpdate: (post: Post, status: PostStatus) => void;
    onDeletePost: (post: Post) => Promise<void>;
}

export function PostsTable({ posts, selectedPost, handleSelectPost, onStatusUpdate, onDeletePost }: PostsTableProps) {
    return (
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">Transformation</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Action</th>
                </tr>
            </thead>
            <tbody>
                {posts?.map((post) => (
                    <tr key={post.id} className={` border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 ${post.id === selectedPost?.id ? "bg-gray-200 dark:bg-gray-700" : ""}`}>
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {post?.transformation?.name}
                        </th>
                        <td className="px-6 py-4">{post.status}</td>
                        <td className="px-6 py-4">
                            <PostActionButtons 
                                post={post}
                                handleSelectPost={handleSelectPost}
                                onStatusUpdate={onStatusUpdate}
                                onDelete={onDeletePost}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}