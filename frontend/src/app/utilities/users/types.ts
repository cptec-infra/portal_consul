export interface User {
  uid: string;
  mail: string;
  uidNumber: string;
  title: string;
  firstname: string;
  lastname: string;
  passwordExpiration: string;
  macs?: string[];
  telephoneNumber?: string;
  homeDirectory?: string;
  memberGroup?: string[];
}
