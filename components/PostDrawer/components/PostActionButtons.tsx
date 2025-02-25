import { Post, PostStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { PenIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostActionButtonsProps {
    post: Post;
    onEdit: () => void;
    onStatusUpdate: (post: Post, status: PostStatus) => void;
    onDelete: (post: Post) => Promise<void>;
}

export function PostActionButtons({ post, onEdit, onStatusUpdate, onDelete }: PostActionButtonsProps) {
    return (
        <>
            <button
                type="button"
                onClick={onEdit}
                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
            >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                    Edit Post <PenIcon className="w-4 h-4 inline-block" />
                </span>
            </button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">Action</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onStatusUpdate(post, PostStatus.QUEUED)}>
                        Add To Process Queue
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusUpdate(post, PostStatus.PUBLISHED)}>
                        Publish Post
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusUpdate(post, PostStatus.DRAFT)}>
                        Set as Draft
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusUpdate(post, PostStatus.ARCHIVED)}>
                        Archive
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onDelete(post)}>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}