export interface CustomerType {
  id: number;
  createdAt: string; // ISO timestamp string
  name: string;
  email: string;
  location: string;
  status: boolean;
  spent: number; // or float if you're doing special calculations, but usually number works
  role: string;
  imgUrl: string;
  verificationStatus: string;
}
