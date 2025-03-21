import { Address } from './address.interface';

export interface NewEventRequest {
    name: string;
    description: string;
    date: Date;
    startTime: Date;
    endTime: Date;
    address: Address;
    eventLogo: string;
    eventBanner: string;
    guests: string[];
}

export interface EventDetailsResponse {
    id: string;
    name: string;
    description: string;
    date: Date;
    startTime: Date;
    endTime: Date;
    address: Address;
    eventLogo: string;
    eventBanner: string;
    guests: string[];
}