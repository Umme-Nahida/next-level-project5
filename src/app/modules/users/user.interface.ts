
export enum Role{
    ADMIN="ADMIN",
    SUPER_ADMIN="SUPER_ADMIN",
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
  isVerified?: boolean;     
  isActive?: isActive;        
  vehicleInfo?: {
    vehicle_type:string;
    vehicle_number:string;
    license_number:string;
    seats_available:string;
    vehicle_model: string;
    vehicle_color: string;
    licenseExpireDate: Date;
  } | null;
  auth: IAuthProvider[];
  createdAt?: Date;
  updatedAt?: Date;
}

