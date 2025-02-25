import { TopNews } from "@/types";
import { EyeIcon } from "lucide-react";


type TopNewsCardProps = {
    topNews: TopNews;
    openTopNewsDrawer: () => void;
};

export default function TopNewsCard({
    topNews,
    openTopNewsDrawer,
}: TopNewsCardProps) {
    return (
        <div
            className={
                "relative mb-2"
            }
        >
            <article
                key={topNews.externalId}
                className="bg-white shadow-lg overflow-hidden hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
            >
                <div className="flex flex-row items-stretch m-8">
                    {topNews.image && (
                        <div className="w-1/3 min-w-[200px]">
                            <img
                                src={topNews.image}
                                alt={topNews.title ?? ""}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    )}
                    <div className="p-6 flex-grow flex flex-col justify-between w-2/3">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 hover:text-gray-700 mb-2">
                                {topNews.title}
                            </h2>
                            {topNews.summary && (
                                <p className="text-gray-600 mb-4">
                                    {topNews.summary}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                            <span>
                                {topNews?.author || "Unknown author"}
                            </span>
                            <span className="mx-2">·</span>
                            <span>
                                {topNews?.category || "Unknown Category"}
                            </span>
                            <span className="mx-2">·</span>
                            <span>
                                {/* {topNews?.publishDate?.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })} */}
                            </span>
                        </div>

                        <div className="flex items-center justify-end mt-4">

                            <button
                                onClick={openTopNewsDrawer}
                                className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800"
                            >
                                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                                    Review Top News{" "}
                                    <EyeIcon className="w-4 h-4 inline-block" />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    );
}