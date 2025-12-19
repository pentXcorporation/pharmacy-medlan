export interface User {
  id: number;
  username: string;
  fullName: string;
  role: 'ADMIN' | 'PHARMACIST' | 'CASHIER';
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user: User;
  };
}

export interface Product {
  id: string;
  name: string;
  barcode: string;
  price: number;
  stock: number;
  category: string;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  date: Date;
  cashierId: string;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  price: number;
}
