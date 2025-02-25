import { Prisma } from '@prisma/client'
export type ArticleSeedWithPosts = Prisma.ArticleSeedGetPayload<{
    include: { posts: true }
}>

export type JobWithArticleSeedsWithPosts = Prisma.JobGetPayload<{
    include: { articleSeeds: {
        include: { posts: true }
    } }
}>