export interface Product {
  id: string;
  name: string;
  categoryId: number;
  markId: number;
  serieNum: number;
  description: string;
  price: string;
  listedForId: number;
  duration: number;
  isavailable: boolean;
  photoUrls: string[];
}
