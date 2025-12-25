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
  photoIds: string[];
}
