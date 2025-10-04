export interface Trainer {
  _id: string,
  name: string,
  email: string,
  phoneNumber:string,
  profilePicture:string,
  role: "trainer",
  gender: 'male' | 'female' | 'other';
  createdAt?: string;
  updatedAt?: string;
  __v: number
}
