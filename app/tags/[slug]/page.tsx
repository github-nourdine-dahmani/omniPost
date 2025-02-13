import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllTags, getTagBySlug } from '@/lib/tags';
import { getPostsByTag } from '@/lib/posts';
import PostCard from '@/components/PostCard';

type TagPageProps = {
    params: { slug: string };
};

export async function generateStaticParams() {
    const tags = await getAllTags();
    return tags.map((tag) => ({
        slug: tag.slug,
    }));
}

export async function generateMetadata({
    params
}: TagPageProps): Promise<Metadata> {
    const { slug } = await params  
    const tag = await getTagBySlug(slug);

    if (!tag) {
        return {
            title: 'Tag Not Found',
            description: 'The requested tag does not exist',
        };
    }

    return {
        title: `${tag.name} - Tag`,
        description: tag.name || `Posts tagged with ${tag.name}`,
        openGraph: {
            title: `${tag.name} - Tag`,
            description: tag.name || `Posts tagged with ${tag.name}`,
        },
    };
}

export default async function TagPage({ params }: TagPageProps) {
    const { slug } = await params
    const tag = await getTagBySlug(slug);

    if (!tag) {
        notFound();
    }

    const posts = await getPostsByTag(slug);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{tag.name}</h1>
            </div>

            {posts.length === 0 ? (
                <p className="text-center text-gray-500">No posts found with this tag.</p>
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