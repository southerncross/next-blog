export interface Comment {
  id: string;
  slug: string;
  content: string;
  author: {
    sub: string;
    name: string;
    picture: string;
  };
  createdAt: Date;
}
