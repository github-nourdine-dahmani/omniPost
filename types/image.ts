
export default interface Image {
  id: number;
  url: string;
  alt?: string | null;
  caption?: string | null;
  postId: number;
  createdAt: Date;
  updatedAt: Date;
};
