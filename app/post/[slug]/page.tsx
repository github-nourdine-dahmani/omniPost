import { getPostBySlug } from "@/lib/posts";

// Add metadata export
export const metadata = {
    title: "AzNews - Latest Posts",
    description: "Latest news and articles from AzNews",
};

// Add revalidate
export const revalidate = 3600; // revalidate every hour

export default async function Post({ params }: { params: { slug: string } }) {
    const post = await getPostBySlug(params.slug);

    console.log(post)

    return (
        <>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="max-w-screen-xl mx-auto p-5 sm:p-8 md:p-12 relative">
                    <div className="bg-cover h-64 text-center overflow-hidden"
                        style={{ "background-image": `url('${post.coverImage}')`, "height": "450px" }}
                    ></div>
                    <div className="max-w-2xl mx-auto">
                        <div
                            className="mt-3 bg-white rounded-b lg:rounded-b-none lg:rounded-r flex flex-col justify-between leading-normal">

                            <div className="">

                                <a href="#"
                                    className="text-xs text-indigo-600 uppercase font-medium hover:text-gray-900 transition duration-500 ease-in-out">
                                    Election
                                </a>,
                                <a href="#"
                                    className="text-xs text-indigo-600 uppercase font-medium hover:text-gray-900 transition duration-500 ease-in-out">
                                    Politics
                                </a>
                                <h1 href="#" className="text-gray-900 font-bold text-3xl mb-2">{post.title}</h1>
                                <p className="text-gray-700 text-xs mt-2">Écrit par:
                                    <a href="#"
                                        className="text-indigo-600 font-medium hover:text-gray-900 transition duration-500 ease-in-out">
                                        {/* {post.author} */}
                                    </a>
                                </p>

                                    {post.text.split("\n").map((line, index) => (
                                        <p key={index} className="text-base leading-8 my-5">
                                            {line}
                                            <br />
                                        </p>
                                    ))}

                                <h3 className="text-2xl font-bold my-5">#1. What is Lorem Ipsum?</h3>

                                <p className="text-base leading-8 my-5">
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                                    industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                                    and scrambled it to make a type specimen book. It has survived not only five centuries, but also the
                                    leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s
                                    with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                                    publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                </p>

                                <blockquote className="border-l-4 text-base italic leading-8 my-5 p-5 text-indigo-600">Lorem Ipsum is simply
                                    dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard
                                    dummy text ever since the 1500s</blockquote>

                                <p className="text-base leading-8 my-5">
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                                    industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type
                                    and scrambled it to make a type specimen book. It has survived not only five centuries, but also the
                                    leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s
                                    with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                                    publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                                </p>

                                <a href="#"
                                    className="text-xs text-indigo-600 font-medium hover:text-gray-900 transition duration-500 ease-in-out">
                                    #Election
                                </a>,
                                <a href="#"
                                    className="text-xs text-indigo-600 font-medium hover:text-gray-900 transition duration-500 ease-in-out">
                                    #people
                                </a>,
                                <a href="#"
                                    className="text-xs text-indigo-600 font-medium hover:text-gray-900 transition duration-500 ease-in-out">
                                    #Election2020
                                </a>,
                                <a href="#"
                                    className="text-xs text-indigo-600 font-medium hover:text-gray-900 transition duration-500 ease-in-out">
                                    #trump
                                </a>,
                                <a href="#"
                                    className="text-xs text-indigo-600 font-medium hover:text-gray-900 transition duration-500 ease-in-out">
                                    #Joe
                                </a>

                            </div>

                        </div>
                    </div>
                </div>            </main>
        </>
    );
}
