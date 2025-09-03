export interface ArcadeCreateUser {
  name: string;
  password: string;
  databases: Record<string, string>;
}

export const CREATE_USER = (userDetails: ArcadeCreateUser) =>
  `create user ${JSON.stringify(userDetails)}`;
