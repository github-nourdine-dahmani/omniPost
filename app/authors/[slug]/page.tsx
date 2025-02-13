import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllAuthors, getAuthorBySlug } from '@/lib/authors';
import { getPostsByAuthor } from '@/lib/posts';
import PostCard from '@/components/PostCard';

type AuthorPageProps = {
    params: { slug: string };   
};

export async function generateStaticParams() {
    const authors = await getAllAuthors();
    return authors.map((author) => ({
        slug: author.slug,
    }));
}

export async function generateMetadata({
    params
}: AuthorPageProps): Promise<Metadata> {
    const { slug } = await params  
    const author = await getAuthorBySlug(slug);

    if (!author) {
        return {
            title: 'Author Not Found',
            description: 'The requested author does not exist',
        };
    }

    return {
        title: `${author.name} - Author`,
        description: author.name || `Posts by ${author.name}`,
        openGraph: {
            title: `${author.name} - Author`,
            description: author.name || `Posts by ${author.name}`,
        },
    };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
    const { slug } = await params  
    const author = await getAuthorBySlug(slug);

    if (!author) {
        notFound();
    }

    const posts = await getPostsByAuthor(author.id);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">{author.name}</h1>
            </div>

            {posts.length === 0 ? (
                <p className="text-center text-gray-500">No posts found with this author.</p>
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