import Link from "next/link";
import Header from "@/components/Header";

export default function NotFound() {
    return (
        <>
            <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Page Not Found
                </h2>
                <p className="text-gray-600 mb-8">
                    Sorry, the page you're looking for doesn't exist or has been
                    removed.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800"
                >
                    Return Home
                </Link>
            </div>
        </>
    );
}
