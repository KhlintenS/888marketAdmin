export default interface ProductTypes {
  id: number;
  name: string;
  description: string;
  price: {
    currency: string;
    amount?: number;
    orignal?: number;
    discounted?: number;
  };
  stock: number;
  imgUrls: string[];
  category: {
    id: number;
    name: string;
  };
  subcategory: {
    id: number;
    name: string;
  };
  createdBy: string | null;
  status?: string;
}
