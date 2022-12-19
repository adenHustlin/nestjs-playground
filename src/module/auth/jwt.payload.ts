export interface JwtPayload {
  userId: number;

  email: string;

  exp: number;
}
