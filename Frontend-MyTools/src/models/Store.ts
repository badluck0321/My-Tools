export interface Product {
  id: string;
  name: string;
  categoryId: number;
  markId: number;
  serieNum: number;
  description: string;
  price: string;
  listedFor: number;
  duration: number;
  isavailable: boolean;
  photoUrls: string[];
}
export interface Store {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  ownerId: string;
  associatsId: [string];
  socialMedias: [string];
}
