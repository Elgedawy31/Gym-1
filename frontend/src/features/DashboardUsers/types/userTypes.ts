import { IUser } from "@/features/auth/types/types";

export interface UsersResponse {
  status: string;
  results: number;
  total: number;
  page: number;
  limit: number;
  data: {
    users: IUser[];
  };
}
