export interface IUser {
  _id: string,
  name: string,
  email: string,
  phoneNumber:string,
  profilePicture:string,
  role: "admin" | "trainer" | "member",
  gender: 'male' | 'female' | 'other';
  createdAt?: string;
  updatedAt?: string;
  __v: number
}

export interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  profilePicture?: File;
  gender: 'male' | 'female' | 'other';
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface AuthRes {
  status: string,
  token: string,
  user: IUser,
}


export interface IUpdateMe {
  name?: string,
  email?: string,
  phoneNumber?:string,
  profilePicture?:File | null,
  gender?: 'male' | 'female' | 'other';
}