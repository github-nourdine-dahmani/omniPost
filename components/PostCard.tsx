import { Post } from "@prisma/client";
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
            </article>
        </div>
    );
}