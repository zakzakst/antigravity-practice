export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // クライアントには返されない場合があるためオプショナル
  createdAt: string;
  updatedAt: string;
}
