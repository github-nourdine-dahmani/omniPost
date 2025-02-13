import Header from "@/components/Header";

export default function Loading() {
    return (
        <>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="animate-pulse">
                    <div className="aspect-w-16 aspect-h-9 mb-8">
                        <div className="w-full h-96 bg-gray-200 rounded-lg" />
                    </div>
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
                    <div className="flex items-center space-x-4 mb-8">
                        <div className="rounded-full bg-gray-200 h-12 w-12" />
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-32" />
                            <div className="h-4 bg-gray-200 rounded w-24" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                    </div>
                </div>
            </div>
        </>
    );
}
