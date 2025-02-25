export interface RawArticleSeed {
    id: number | null;
    externalId: string | null;
    title: string | null;
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

export enum Category {
    Politics = "Politics",
    Sports = "Sports",
    Business = "Business",
    Technology = "Technology",
    Entertainment = "Entertainment",
    Health = "Health",
    Science = "Science",
    Lifestyle = "Lifestyle",
    Travel = "Travel",
    Culture = "Culture",
    Education = "Education",
    Environment = "Environment",
    Other = "Other",
}

export enum Language {
    Politics = "Politics",
    Sports = "Sports",
    Business = "Business",
    Technology = "Technology",
    Entertainment = "Entertainment",
    Health = "Health",
    Science = "Science",
    Lifestyle = "Lifestyle",
    Travel = "Travel",
    Culture = "Culture",
    Education = "Education",
    Environment = "Environment",
    Other = "Other",
}

export enum SourceCountry {
    Politics = "Politics",
    Sports = "Sports",
    Business = "Business",
    Technology = "Technology",
    Entertainment = "Entertainment",
    Health = "Health",
    Science = "Science",
    Lifestyle = "Lifestyle",
    Travel = "Travel",
    Culture = "Culture",
    Education = "Education",
    Environment = "Environment",
    Other = "Other",
}
