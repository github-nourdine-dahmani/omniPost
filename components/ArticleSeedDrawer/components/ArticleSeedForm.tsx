import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArticleSeed } from "@prisma/client";
import { LinkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { PlugIcon } from "lucide-react";
import { Job } from "@prisma/client";
import { TopNews } from "@/types";

type ArticleSeedFormProps = {
    articleSeed: ArticleSeed;
    topNews: TopNews;
    onSubmit: (formData: FormData) => Promise<void>;
    onClose: () => void;
    isLoading: boolean;
};

export const ArticleSeedForm: React.FC<ArticleSeedFormProps> = ({
    articleSeed,
    topNews,
    onSubmit,
    onClose,
    isLoading,
}) => {

    const initialArticleSeedData = JSON.parse(articleSeed?.seedData ?? '{}');

    const [articleSeedData, setArticleSeedData] = useState(initialArticleSeedData);

    // Function to reset the form
    const resetForm = () => {

        setArticleSeedData({
            ...topNews,
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setArticleSeedData((prevData: any) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setArticleSeedData((prevData: any) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <form action={onSubmit}>
            <div className="mb-4">
                {articleSeedData?.image && (
                    <img
                        src={articleSeedData.image}
                        alt={articleSeedData.title}
                        className="w-full h-auto mb-4"
                    />
                )}
                <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700"
                >
                    Image URL
                </label>
                <Input
                    type="text"
                    id="image"
                    name="image"
                    placeholder="Image URL"
                    defaultValue={articleSeedData?.image ?? ""}
                />
            </div>

            {/* Form fields for title and content */}
            <div className="mb-4">
                <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                >
                    Title
                </label>
                <Input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Title"
                    value={articleSeedData.title}
                    onChange={handleInputChange}
                />
            </div>

            <div className="mb-4">
                <label
                    htmlFor="summary"
                    className="block text-sm font-medium text-gray-700"
                >
                    Summary
                </label>
                <Textarea
                    id="summary"
                    name="summary"
                    placeholder="Summary"
                    value={articleSeedData.summary}
                    onChange={handleTextChange}
                    rows={5}
                />
            </div>

            <div className="mb-4">
                <label
                    htmlFor="text"
                    className="block text-sm font-medium text-gray-700"
                >
                    Text
                </label>
                <Textarea
                    id="text"
                    name="text"
                    placeholder="Text"
                    value={articleSeedData.text}
                    onChange={handleTextChange}
                    rows={20}
                />
            </div>

            <div className="mb-4">
                <label
                    htmlFor="url"
                    className="block text-sm font-medium text-gray-700 cursor-pointer"
                    onClick={() =>
                        articleSeedData?.url &&
                        window.open(articleSeedData.url)
                    }
                >
                    <span className="inline-block align-middle">
                        Seed URL{" "}
                        <LinkIcon className="h-4 w-4 ml-1 inline-block" />
                    </span>
                </label>
                <Input
                    type="text"
                    id="url"
                    name="url"
                    placeholder="Seed URL"
                    value={articleSeedData.url}
                    onChange={handleInputChange}
                />
            </div>

            {/* Form actions */}
            <div className="sticky bottom-0 left-0 right-0 bg-gray-50 p-4 border-t shadow-md flex justify-between space-x-2 z-10">
                <button
                    type="button"
                    onClick={onClose}
                    className="relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800"
                >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                        Cancel
                    </span>
                </button>
                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={resetForm}
                        className="relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-lime-800"
                    >
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                            Reset
                            {/* <ArrowsRotateIcon className="h-4 w-4 ml-1 inline-block" /> */}
                        </span>
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                    >
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                            {isLoading ? "Saving..." : "Save"}
                            <CheckIcon className="h-4 w-4 ml-1 inline-block" />
                        </span>
                    </button>
                </div>
            </div>
        </form>
    );
};