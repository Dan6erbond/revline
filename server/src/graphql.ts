
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum FuelCategory {
    PETROL = "PETROL",
    DIESEL = "DIESEL",
    ELECTRIC = "ELECTRIC",
    LPG = "LPG",
    OTHER = "OTHER"
}

export enum OctaneRating {
    RON91 = "RON91",
    RON95 = "RON95",
    RON98 = "RON98",
    RON100 = "RON100",
    E85 = "E85",
    RACE = "RACE"
}

export interface CreateCarInput {
    name: string;
    make?: Nullable<string>;
    model?: Nullable<string>;
    year?: Nullable<number>;
}

export interface UpdateCarInput {
    id: string;
    name?: Nullable<string>;
    make?: Nullable<string>;
    model?: Nullable<string>;
    year?: Nullable<number>;
}

export interface CreateFuelUpInput {
    carId: string;
    occurredAt: Date;
    station: string;
    amountLiters: number;
    cost: number;
    fuelCategory: FuelCategory;
    octane?: Nullable<OctaneRating>;
    odometerKm?: Nullable<number>;
    notes?: Nullable<string>;
    isFullTank: boolean;
    locationLat?: Nullable<number>;
    locationLng?: Nullable<number>;
}

export interface UpdateFuelUpInput {
    id: string;
    occurredAt?: Nullable<Date>;
    station?: Nullable<string>;
    amountLiters?: Nullable<number>;
    cost?: Nullable<number>;
    fuelCategory?: Nullable<FuelCategory>;
    octane?: Nullable<OctaneRating>;
    odometerKm?: Nullable<number>;
    notes?: Nullable<string>;
    isFullTank?: Nullable<boolean>;
    locationLat?: Nullable<number>;
    locationLng?: Nullable<number>;
}

export interface CreateOdometerReadingInput {
    carId: string;
    readingKm: number;
    locationLat?: Nullable<number>;
    locationLng?: Nullable<number>;
    notes?: Nullable<string>;
}

export interface UpdateOdometerReadingInput {
    id: string;
    readingKm?: Nullable<number>;
    locationLat?: Nullable<number>;
    locationLng?: Nullable<number>;
    notes?: Nullable<string>;
}

export interface Car {
    id: string;
    name: string;
    make?: Nullable<string>;
    model?: Nullable<string>;
    year?: Nullable<number>;
    owner: User;
    createdAt: Date;
    updatedAt: Date;
    fuelUps: FuelUp[];
    odometerReadings: OdometerReading[];
}

export interface IQuery {
    car(id: string): Nullable<Car> | Promise<Nullable<Car>>;
    cars(): Car[] | Promise<Car[]>;
    profile(): Nullable<Profile> | Promise<Nullable<Profile>>;
    me(): Nullable<User> | Promise<Nullable<User>>;
}

export interface IMutation {
    createCar(input: CreateCarInput): Car | Promise<Car>;
    updateCar(input: UpdateCarInput): Car | Promise<Car>;
    createFuelUp(input: CreateFuelUpInput): FuelUp | Promise<FuelUp>;
    updateFuelUp(input: UpdateFuelUpInput): FuelUp | Promise<FuelUp>;
    createOdometerReading(input: CreateOdometerReadingInput): OdometerReading | Promise<OdometerReading>;
    updateOdometerReading(input: UpdateOdometerReadingInput): OdometerReading | Promise<OdometerReading>;
    deleteOdometerReading(id: string): boolean | Promise<boolean>;
}

export interface FuelUp {
    id: string;
    car: Car;
    occurredAt: Date;
    station: string;
    amountLiters: number;
    cost: number;
    fuelCategory: FuelCategory;
    octane?: Nullable<OctaneRating>;
    odometerReading?: Nullable<OdometerReading>;
    notes?: Nullable<string>;
    isFullTank: boolean;
    locationLat?: Nullable<number>;
    locationLng?: Nullable<number>;
    createdAt: Date;
    updatedAt: Date;
}

export interface OdometerReading {
    id: string;
    carId: string;
    readingKm: number;
    locationLat?: Nullable<number>;
    locationLng?: Nullable<number>;
    notes?: Nullable<string>;
    createdAt: Date;
    updatedAt: Date;
    car: Car;
}

export interface Profile {
    id: string;
    username: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface User {
    id: string;
    email: string;
    profile?: Nullable<Profile>;
    createdAt: Date;
    updatedAt: Date;
}

type Nullable<T> = T | null;
