export interface Product {
  id: string;
  name: string;
  categoryId: number;
  markId: number;
  serieNum: number;
  description: string;
  price: number | string;
  listedForId: number;
  duration: number;
  ownerId?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  isavailable: boolean;
  photoUrls: string[];
}
