export type Product = {
  title: string;
  slug: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  discount: number;
  finalPrice: number;
  stock: number;
  occasion: [string];
  isCustomizable: boolean;
  customizationFields: [string];
  giftWrapAvailable: boolean;
  giftMessageAllowed: boolean;
  ratings: {
    average: number;
    count: number;
  };
  tags: [string];
  isRecommended: boolean;
  totalSold: number;
  deliveryTime: string;
  limitedEdition: boolean;
  seasonalTag: string;
  images: [string];
};
