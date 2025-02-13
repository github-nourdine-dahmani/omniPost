export interface ArticleSeed {
    externalId: string | null;
    parentExternalId: string | null;
    title: string;
    text: string | null;
    summary: string | null;
    language: string | null;
    url: string | null;
    source_country: string | null;
    image: string | null;
    category: string | null;
    publishDate: Date | null;
    author: string | null;
    seedJobId: number;
}

// export interface Article extends ArticleSeed {
//     id: number;
//     slug: string;
//     published: boolean;
//     createdAt: Date;
//     updatedAt: Date;
//     publishedAt: Date | null;
// }

export enum Category {
    Politics = 'Politics',
    Sports = 'Sports',
    Business = 'Business',
    Technology = 'Technology',
    Entertainment = 'Entertainment',
    Health = 'Health',
    Science = 'Science',
    Lifestyle = 'Lifestyle',
    Travel = 'Travel',
    Culture = 'Culture',
    Education = 'Education',
    Environment = 'Environment',
    Other = 'Other',
}

export enum Language {
    Politics = 'Politics',
    Sports = 'Sports',
    Business = 'Business',
    Technology = 'Technology',
    Entertainment = 'Entertainment',
    Health = 'Health',
    Science = 'Science',
    Lifestyle = 'Lifestyle',
    Travel = 'Travel',
    Culture = 'Culture',
    Education = 'Education',
    Environment = 'Environment',
    Other = 'Other',
}

export enum SourceCountry {
    Politics = 'Politics',
    Sports = 'Sports',
    Business = 'Business',
    Technology = 'Technology',
    Entertainment = 'Entertainment',
    Health = 'Health',
    Science = 'Science',
    Lifestyle = 'Lifestyle',
    Travel = 'Travel',
    Culture = 'Culture',
    Education = 'Education',
    Environment = 'Environment',
    Other = 'Other',
}