import { getAllPosts, getPostBySlug } from "@/lib/posts";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

import PageClient from './page-client';
import { fetchTopNews } from "@/lib/worldnewsapi";
import { getArticleBySlug } from "@/lib/article";

type Props = {
  params: {
    slug: string;
  };
};

// export async function generateStaticParams() {
//   const articles = await fetchTopNews();
//   return articles.map((article) => ({
//     slug: article.id,
//   }));
// }

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const { slug } = await params
//   // const article = await getPostBySlug(slug);

//   const articles = await fetchTopNews();
//   const article = articles.find((article) => article.id === slug);

//   if (!article) {
//     return {
//       title: "Article Not Found",
//     };
//   }

//   return {
//     title: `${article.title} - AzNews`,
//     description: article.excerpt || `Read ${article.title} on AzNews`,
//   };
// }

export const revalidate = 3600;

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params

  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <PageClient article={article} />
    </>
  );
}
