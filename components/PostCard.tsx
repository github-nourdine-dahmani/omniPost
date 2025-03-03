import { Post, PostPublishStatus, PostTransformationStatus } from "@prisma/client";
import { PenIcon } from "lucide-react";


type PostCardProps = {
    post: Post;
    openPostDrawer: () => void;
};

export default function PostCard({
    post,
    openPostDrawer,
}: PostCardProps) {
    return (
        <div
            className={
                "relative mb-2"
            }
        >
            <article
                key={post.id}
                className="bg-white shadow-lg overflow-hidden hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            >
                <div className="flex flex-row items-stretch m-8">
                    {post.coverImage && (
                        <div className="w-1/3 min-w-[200px]">
                            <img
                                src={post.coverImage}
                                alt={post.title ?? ""}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    )}
                    <div className="p-6 flex-grow flex flex-col justify-between w-2/3">
                        <div>
                            {post.transformationStatus === PostTransformationStatus.QUEUED && <span className="bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-purple-400 border border-purple-400">Queued</span>}
                            {post.transformationStatus === PostTransformationStatus.DISCARDED && <span className="bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-gray-400 border border-gray-500">Discarded</span>}
                            {post.transformationStatus === PostTransformationStatus.COMPLETED && <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-green-400 border border-green-400">Completed</span>}
                            {post.transformationStatus === PostTransformationStatus.FAILED && <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-red-400 border border-red-400">Failed</span>}
                            {post.transformationStatus === PostTransformationStatus.PROCESSING && <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300">Processing</span>}
                            <h2 className="text-xl font-semibold text-gray-900 hover:text-gray-700 mb-2">
                                {post.title}
                            </h2>
                            {post.summary && (
                                <p className="text-gray-600 mb-4">
                                    {post.summary}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                            <span>
                                {/* {post?.author || "Unknown author"} */}
                            </span>
                            <span className="mx-2">·</span>
                            <span>
                                {/* {post?.category || "Unknown Category"} */}
                            </span>
                            <span className="mx-2">·</span>
                            <span>
                                {/* {topNews?.publishDate?.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })} */}
                            </span>
                        </div>

                        <div className="flex items-center justify-end mt-4">

                            <button
                                onClick={openPostDrawer}
                                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                            >
                                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                    Manage Post{" "}
                                    <PenIcon className="w-4 h-4 inline-block" />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                {post.publishStatus === PostPublishStatus.PUBLISHED &&
                    <div className="flex justify-end">
                        <strong
                            className="-me-[2px] -mb-[2px] inline-flex items-center gap-1 rounded-ss-xl rounded-ee-xl bg-green-600 px-3 py-1.5 text-white"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                />
                            </svg>

                            <span className="text-[10px] font-medium sm:text-xs">Published !</span>
                        </strong>
                    </div>}

                {post.publishStatus === PostPublishStatus.DRAFT &&
                    <div className="flex justify-end">
                        <strong
                            className="-me-[2px] -mb-[2px] inline-flex items-center gap-1 rounded-ss-xl rounded-ee-xl bg-gray-600 px-3 py-1.5 text-white"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="size-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                                />
                            </svg>

                            <span className="text-[10px] font-medium sm:text-xs">Draft</span>
                        </strong>
                    </div>}
            </article>
        </div>
    );
}