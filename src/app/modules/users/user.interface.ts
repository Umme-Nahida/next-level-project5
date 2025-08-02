
export enum Role{
    ADMIN="ADMIN",
    RIDER="RIDER",
    DRIVER="DRIVER"
}

export interface IAuthProvider{
    provider: 'google' | 'credential';
    providerId: string;
}

export enum isActive{
    ACTIVE = "ACTIVE",
    INACTIVE= "INACTIVE",
    BLOCKED="BLOCKED"
}


export interface IUser {
  _id?: string;                
  name: string;
  email: string;
  password: string;
  role: Role
  isApproved?: boolean;      
  isActive?: isActive;        
  vehicleInfo?: {
    model: string;
    licensePlate: string;
    color: string;
  } | null;
  auth: IAuthProvider[];
  createdAt?: Date;
  updatedAt?: Date;
}

