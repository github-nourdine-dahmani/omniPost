declare module 'newsapi' {
  class NewsAPI {
    constructor(apiKey: string);
    v2: {
      topHeadlines: (params?: {
        country?: string;
        category?: string;
        sources?: string;
        q?: string;
        pageSize?: number;
        page?: number;
      }) => Promise<{
        status: string;
        totalResults: number;
        articles: Array<{
          source: { id: string | null; name: string };
          author: string | null;
          title: string;
          description: string | null;
          url: string;
          urlToImage: string | null;
          publishedAt: string;
          content: string | null;
        }>;
      }>;
    };
  }
  export = NewsAPI;
}
