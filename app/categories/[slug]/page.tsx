import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllCategories, getCategoryBySlug } from '@/lib/categories';
import { getPostsByCategory } from '@/lib/posts';
import PostCard from '@/components/PostCard';

type CategoryPageProps = {
    params: { slug: string };
};

export async function generateStaticParams() {
    const categories = await getAllCategories();
    return categories.map((category) => ({
        slug: category.slug,
    }));
}

export async function generateMetadata({
    params
}: CategoryPageProps): Promise<Metadata> {
    const { slug } = await params  
    const category = await getCategoryBySlug(slug);

    if (!category) {
        return {
            title: 'Category Not Found',
            description: 'The requested category does not exist',
        };
    }

    return {
        title: `${category.name} - Category`,
        description: category.description || `Posts in the ${category.name} category`,
        openGraph: {
            title: `${category.name} - Category`,
            description: category.description || `Posts in the ${category.name} category`,
        },
    };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { slug } = await params;
    const category = await getCategoryBySlug(slug);

    if (!category) {
        notFound();
    }

    const posts = await getPostsByCategory(slug);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
                {category.description && (
                    <p className="text-gray-600">{category.description}</p>
                )}
            </div>

            {posts.length === 0 ? (
                <p className="text-center text-gray-500">No posts found in this category.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
}