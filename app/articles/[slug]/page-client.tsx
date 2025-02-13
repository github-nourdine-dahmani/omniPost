'use client';

import React, { useState } from 'react';
import ArticleDrawer from '@/components/ArticleDrawer';

import Link from "next/link";

import { Article } from "@prisma/client";

export default function NewsPageClient({ article }: { article: Article }) {
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  console.log(article);

  return (
    <>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          {/* Featured Image */}
          {article.image && (
            <div className="mb-8">
              <img
                src={article.image}
                alt={article.title}
                className="object-cover w-full h-96 rounded-lg"
              />
              {/* {article.image.caption && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  {article.image.caption}
                </p>
              )} */}
            </div>
          )}

          {/* Title */}
          <div className="mb-12 flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-900 mb-0">
              {article.title}
            </h1>
            <button
              onClick={() => setIsEditDrawerOpen(true)}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
              title="Edit Post"
            >
              ✏️
            </button>
          </div>

          {/* Author Info */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="flex items-center">
              <img
                src={
                  article.author ||
                  "https://via.placeholder.com/40"
                }
                alt={article.author ?? "Author Unknown"}
                className="w-12 h-12 rounded-full mr-3"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {article.author}
                </p>
                <p
                  suppressHydrationWarning
                  className="text-sm text-gray-500"
                >
                  {article?.publishedAt?.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {/* <div className="flex flex-wrap gap-2 mb-8">
            {post.tags && post.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="px-3 py-1 bg-gray-100 text-sm text-gray-700 rounded-full hover:bg-gray-200"
              >
                #{tag.name}
              </Link>
            ))}
          </div> */}
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {article?.text?.split("\n").map((paragraph, index) => (
            <p className="mb-4" key={index}>
              {paragraph}
            </p>
          ))}

<p className="text-gray-600 mb-4">
                                    {article.text}
                                </p>
        </div>

        {/* Category */}
        {article.category && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href={`/categories/${article.category}`}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Posted in {article.category}
            </Link>
          </div>
        )}

        {/* Edit Drawer */}
        <ArticleDrawer
          article={article}
          isOpen={isEditDrawerOpen}
          onClose={() => setIsEditDrawerOpen(false)}
        />
      </article>
    </>
  );
}
