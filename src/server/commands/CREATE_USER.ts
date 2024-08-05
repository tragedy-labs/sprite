export interface IArcadeCreateUser {
  name: string;
  password: string;
  databases: Record<string, string>;
}

export const CREATE_USER = (userDetails: IArcadeCreateUser) =>
  `CREATE USER ${JSON.stringify(userDetails)}`;
