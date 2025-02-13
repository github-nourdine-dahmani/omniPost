import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const authors = [
  {
    name: 'John Doe',
    slug: 'john-doe',
    email: 'john@example.com',
    bio: 'Senior tech writer with 10 years of experience',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
  },
  {
    name: 'Jane Smith',
    slug: 'jane-smith',
    email: 'jane@example.com',
    bio: 'Award-winning journalist and editor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane',
  },
]

const categories = [
  {
    name: 'Technology',
    slug: 'technology',
    description: 'Latest in tech news and innovations',
  },
  {
    name: 'Science',
    slug: 'science',
    description: 'Scientific discoveries and research',
  },
  {
    name: 'Culture',
    slug: 'culture',
    description: 'Arts, entertainment, and cultural news',
  },
]

const tags = [
  { name: 'AI', slug: 'ai' },
  { name: 'Web Development', slug: 'web-development' },
  { name: 'Space', slug: 'space' },
  { name: 'Climate', slug: 'climate' },
  { name: 'Movies', slug: 'movies' },
]

const posts = [
  {
    title: 'The Future of Artificial Intelligence',
    slug: 'future-of-ai',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    excerpt: 'Exploring the latest developments in AI and machine learning',
    published: true,
    images: [
      {
        url: 'https://picsum.photos/seed/ai/800/600',
        alt: 'AI illustration',
        caption: 'The future of AI',
      },
    ],
    tagIndexes: [0, 1], // Will connect to AI and Web Development tags
  },
  {
    title: 'Space Exploration in 2024',
    slug: 'space-exploration-2024',
    content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    excerpt: 'Latest developments in space exploration',
    published: true,
    images: [
      {
        url: 'https://picsum.photos/seed/space/800/600',
        alt: 'Space exploration',
        caption: 'Mars mission preparation',
      },
    ],
    tagIndexes: [2, 3], // Will connect to Space and Climate tags
  },
  {
    title: 'Web Development Trends',
    slug: 'web-development-trends',
    content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    excerpt: 'The latest trends in web development',
    published: true,
    images: [
      {
        url: 'https://picsum.photos/seed/web/800/600',
        alt: 'Web development',
        caption: 'Modern web development',
      },
    ],
    tagIndexes: [1], // Will connect to Web Development tag
  },
]

async function main() {
  // Clean the database
  await prisma.image.deleteMany()
  await prisma.post.deleteMany()
  await prisma.author.deleteMany()
  await prisma.category.deleteMany()
  await prisma.tag.deleteMany()

  console.log('Cleaned database...')

  // Create authors
  const createdAuthors = await Promise.all(
    authors.map((author) =>
      prisma.author.create({
        data: author,
      })
    )
  )

  console.log('Created authors...')

  // Create categories
  const createdCategories = await Promise.all(
    categories.map((category) =>
      prisma.category.create({
        data: category,
      })
    )
  )

  console.log('Created categories...')

  // Create tags
  const createdTags = await Promise.all(
    tags.map((tag) =>
      prisma.tag.create({
        data: tag,
      })
    )
  )

  console.log('Created tags...')

  // Create posts with relationships
  for (const post of posts) {
    const { images, tagIndexes, ...postData } = post
    await prisma.post.create({
      data: {
        ...postData,
        author: {
          connect: { id: createdAuthors[Math.floor(Math.random() * authors.length)].id },
        },
        category: {
          connect: { id: createdCategories[Math.floor(Math.random() * categories.length)].id },
        },
        tags: {
          connect: tagIndexes.map((index) => ({ id: createdTags[index].id })),
        },
        images: {
          create: images,
        },
      },
    })
  }

  console.log('Created posts...')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
