import { Address } from './address.interface';

export interface NewPartyRequest {
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  address: Address;
  logo: string;
  banner: string;
}

export interface PartyDetailsResponse {
  id: string;
  name: string;
  description: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  address: Address;
  banner: string;
}
