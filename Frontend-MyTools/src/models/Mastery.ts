export interface Mastery {
  id: string;
  masterId: string;
  masterName?: string;
  masterPhone?: string;
  title: string;
  typeId?: number | string;
  masteryTypeId?: number | string;
  masteryStatuId?: string;
  pricingType?: string;
  price: number | string;
  city?: string;
  experienceYears?: number;
  description: string;
  photoUrls: string[];
}
