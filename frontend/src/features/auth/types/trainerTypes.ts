

export interface Trainer {
  _id: string;
  name: string;
  email: string;
  profilePicture?: string;
  phoneNumber?: string;
  gender: 'male' | 'female';
}