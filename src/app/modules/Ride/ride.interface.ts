export interface IRide {
  _id?: string;               
  rider: string;               
  driver?: string;            
  pickupLocation: {
    lat: number;
    lng: number;
    address?: string;
  };
  destinationLocation: {
    lat: number;
    lng: number;
    address?: string;
  };
  status: 
     'requested'
    | 'accepted'
    | 'picked_up'
    | 'in_transit'
    | 'completed'
    | 'cancelled';
  fare?: number;
  timestampsHistory?: {
    requestedAt?: Date;
    acceptedAt?: Date;
    pickedUpAt?: Date;
    inTransitAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
