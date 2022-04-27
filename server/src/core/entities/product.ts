export interface ProductSnapshot {
  url: string;
  name: string;
  price: number;
}

export interface Product extends ProductSnapshot {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}
