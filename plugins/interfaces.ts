export interface Product {
  _id: string;
  rating: [];
  title: string;
  description: string;
  photos: Photo;
  price: number;
  stockQuantity: number;
  category: string;
  owner: string;
}

export interface Photo {
  id: number;
  photo: string;
}
