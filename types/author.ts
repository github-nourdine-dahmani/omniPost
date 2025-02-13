export default interface Author {
    id: number;
    name: string;
    slug: string;
    email: string;
    bio?: string | null;
    avatar?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
