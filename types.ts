export interface Merchant {
  id: number;
  name: string;
  distance: number;
}

export interface OfferItem {
  id: number;
  title: string;
  description: string;
  category: number;
  merchants: Merchant[];
  valid_to: string;
}

export interface Data {
  offers: OfferItem[];
}