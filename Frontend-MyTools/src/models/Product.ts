export interface Product {
  id: string;
  name: string;
  categoryId: number | string;
  markId: number | string;
  serieNum: number | string;
  description: string;
  price: number | string;
  conditionId?: number | string;
  listedForId: number | string;
  currencyId?: string;
  duration: number;
  ownerId?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  isavailable: boolean;
  photoUrls: string[];
}
