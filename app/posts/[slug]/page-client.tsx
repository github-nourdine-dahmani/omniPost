'use client';

import React, { useState } from 'react';
import PostEditDrawer from '@/components/PostEditDrawser';

import Link from "next/link";

import { Post } from '@/types';

export default function PostPageClient({ post }: { post: Post }) {
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  return (
    <>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          {/* Featured Image */}
          {post.images && post.images[0] && (
            <div className="mb-8">
              <img
                src={post.images[0].url}
                alt={post.images[0].alt || post.title}
                className="object-cover w-full h-96 rounded-lg"
              />
              {post.images[0].caption && (
                <p className="text-sm text-gray-500 mt-2 text-center">
                  {post.images[0].caption}
                </p>
              )}
            </div>
          )}

          {/* Title */}
          <div className="mb-12 flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-900 mb-0">
              {post.title}
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
                  post?.author?.avatar ||
                  "https://via.placeholder.com/40"
                }
                alt={post?.author?.name}
                className="w-12 h-12 rounded-full mr-3"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {post?.author?.name}
                </p>
                <p
                  suppressHydrationWarning
                  className="text-sm text-gray-500"
                >
                  {typeof window !== 'undefined' 
                    ? new Date(post.publishedAt || post.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
                    : new Date(post.publishedAt || post.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags && post.tags.map((tag) => (
              <Link
                key={tag.id}
                href={`/tags/${tag.slug}`}
                className="px-3 py-1 bg-gray-100 text-sm text-gray-700 rounded-full hover:bg-gray-200"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {post.content.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Category */}
        {post.category && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href={`/categories/${post.category.slug}`}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Posted in {post.category.name}
            </Link>
          </div>
        )}

        {/* Edit Drawer */}
        <PostEditDrawer
          post={post}
          isOpen={isEditDrawerOpen}
          onClose={() => setIsEditDrawerOpen(false)}
        />
      </article>
    </>
  );
}
