export enum Role {
  Client = "client",
  Staff = "staff",
  Admin = "admin",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}
