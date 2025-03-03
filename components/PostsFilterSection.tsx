import { Job, PostPublishStatus } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Transformation } from "@prisma/client";

interface PostsFilterSectionProps {
    transformations: Transformation[];
    // categories: string[];
    selectedTransformation: Transformation;
    selectedPublishStatus: PostPublishStatus[];
    onTransformationSelect: (transformation: Transformation) => void;
    onPublishStatusToggle: (status: PostPublishStatus) => void;
}

export const PostsFilterSection = ({
    transformations,
    // categories,
    selectedTransformation,
    selectedPublishStatus,
    onTransformationSelect,
    // onTransformationSelect,
    onPublishStatusToggle,
}: PostsFilterSectionProps) => (
    <div className="w-1/4 pr-4 border-r overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 sticky top-0 bg-white z-10">
            Posts
        </h2>

        <div>
            <h3 className="text-lg font-medium mb-2">Transformations</h3>
            <ScrollArea className="h-72 rounded-md border">
                <div className="p-2">
                    {transformations.map((transformation, index) => (
                        <div key={index}>
                            <div
                                className={`text-sm flex items-center space-x-2 cursor-pointer hover:bg-gray-100 ${selectedTransformation.id === transformation.id
                                    ? "bg-gray-200"
                                    : ""
                                    }`}
                                onClick={() => onTransformationSelect(transformation)}
                            >
                                {transformation.name}
                                <span className="ml-5 bg-blue-100 text-blue-800 text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-sm dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                                    <svg
                                        className="w-2.5 h-2.5 me-1.5"
                                        enableBackground="new 0 0 48 48"
                                        height="48px"
                                        id="Layer_1"
                                        version="1.1"
                                        viewBox="0 0 48 48"
                                        width="48px"
                                    >
                                        <path
                                            clipRule="evenodd"
                                            d="M37,47H11c-2.209,0-4-1.791-4-4V5c0-2.209,1.791-4,4-4h18.973  c0.002,0,0.005,0,0.007,0h0.02H30c0.32,0,0.593,0.161,0.776,0.395l9.829,9.829C40.84,11.407,41,11.68,41,12l0,0v0.021  c0,0.002,0,0.003,0,0.005V43C41,45.209,39.209,47,37,47z M31,4.381V11h6.619L31,4.381z M39,13h-9c-0.553,0-1-0.448-1-1V3H11  C9.896,3,9,3.896,9,5v38c0,1.104,0.896,2,2,2h26c1.104,0,2-0.896,2-2V13z M33,39H15c-0.553,0-1-0.447-1-1c0-0.552,0.447-1,1-1h18  c0.553,0,1,0.448,1,1C34,38.553,33.553,39,33,39z M33,31H15c-0.553,0-1-0.447-1-1c0-0.552,0.447-1,1-1h18c0.553,0,1,0.448,1,1  C34,30.553,33.553,31,33,31z M33,23H15c-0.553,0-1-0.447-1-1c0-0.552,0.447-1,1-1h18c0.553,0,1,0.448,1,1C34,22.553,33.553,23,33,23  z"
                                            fillRule="evenodd"
                                        />
                                    </svg>
                                    {transformation.posts.length} posts
                                </span>
                                {/* <Badge className="ml-2">{job.articles.length} saved articles</Badge> */}
                            </div>
                            <Separator className="my-2" />
                        </div>
                    ))}
                </div>
            </ScrollArea>
            <h3 className="text-lg font-medium mb-2">Status</h3>
            <div className="flex flex-col flex-wrap">
            {Object.keys(PostPublishStatus).map((status, index) => (
                <label key={index} className="inline-flex items-center mb-5 cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" checked={selectedPublishStatus.includes(status as PostPublishStatus)}
                        onChange={() => onPublishStatusToggle(status as PostPublishStatus)} />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{status}</span>
                </label>
            ))}
            </div>
        </div>
    </div>
);
