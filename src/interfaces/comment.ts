export interface Comment {
  id: string;
  slug: string;
  content: string;
  deletable?: boolean;
  author: {
    name: string;
    picture: string;
  };
  createdAt: string;
}
