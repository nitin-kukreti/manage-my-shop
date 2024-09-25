export interface AuthUserInfoInterface {
  id: number;
  email: string;
  roles: {
    role: string;
    shop: number;
  }[];
}
