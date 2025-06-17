export default interface OrderType {
  id: number;
  status: string;
  createdAt: string;
  detail: { product: number; quantity: number }[];
  customer: {
    name: string;
    email: string;
    img_url: string; // Optional, in case some customers don't have an avatar
  };
}
