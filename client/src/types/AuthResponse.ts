import { IUser } from "./IUser";

export interface AuthResponse {
  tokens: {
    accessToken: string;
    refreshToken: string;
  }
  user: IUser;
}
