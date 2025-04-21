
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum DragResultUnit {
    Kph = "Kph",
    Km = "Km"
}

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

export enum FuelVolumeUnit {
    Liter = "Liter",
    Gallon = "Gallon",
    ImperialGallon = "ImperialGallon"
}

export enum DistanceUnit {
    Kilometers = "Kilometers",
    Miles = "Miles"
}

export enum FuelConsumptionUnit {
    MPG = "MPG",
    MPG_Imperial = "MPG_Imperial",
    KPL = "KPL",
    LP100K = "LP100K"
}

export enum TemperatureUnit {
    Celsius = "Celsius",
    Fahrenheit = "Fahrenheit"
}

export enum ProfileVisibility {
    Public = "Public",
    Private = "Private"
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

export interface CreateDragSessionInput {
    carId: string;
    title: string;
    notes?: Nullable<string>;
}

export interface CreateDragResultInput {
    sessionId: string;
    unit: DragResultUnit;
    value: number;
    result: number;
    notes?: Nullable<string>;
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

export interface UploadMediaInput {
    carId: string;
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

export interface UpdateProfileInput {
    username?: Nullable<string>;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    currencyCode?: Nullable<string>;
    fuelVolumeUnit?: Nullable<FuelVolumeUnit>;
    distanceUnit?: Nullable<DistanceUnit>;
    fuelConsumptionUnit?: Nullable<FuelConsumptionUnit>;
    temperatureUnit?: Nullable<TemperatureUnit>;
}

export interface UploadProfilePictureInput {
    picture: Upload;
}

export interface CreateServiceItemInput {
    carId: string;
    label: string;
    notes?: Nullable<string>;
    estimatedDuration?: Nullable<number>;
    defaultIntervalKm?: Nullable<number>;
    defaultIntervalMonths?: Nullable<number>;
    tags?: Nullable<string[]>;
}

export interface UpdateServiceItemInput {
    id: string;
    label?: Nullable<string>;
    notes?: Nullable<string>;
    estimatedDuration?: Nullable<number>;
    defaultIntervalKm?: Nullable<number>;
    defaultIntervalMonths?: Nullable<number>;
    tags?: Nullable<string[]>;
}

export interface CreateServiceLogInput {
    carId: string;
    datePerformed: Date;
    odometerKm?: Nullable<number>;
    serviceItemIds: string[];
    scheduleId?: Nullable<string>;
    notes?: Nullable<string>;
    performedBy?: Nullable<string>;
}

export interface UpdateServiceLogInput {
    id: string;
    datePerformed?: Nullable<Date>;
    odometerKm?: Nullable<number>;
    serviceItemIds?: Nullable<string[]>;
    scheduleId?: Nullable<string>;
    notes?: Nullable<string>;
    performedBy?: Nullable<string>;
}

export interface CreateServiceScheduleInput {
    carId: string;
    title: string;
    serviceItemIds: string[];
    repeatEveryKm?: Nullable<number>;
    repeatEveryMonths?: Nullable<number>;
    startsAtKm?: Nullable<number>;
    startsAtDate?: Nullable<Date>;
    notes?: Nullable<string>;
}

export interface UpdateServiceScheduleInput {
    id: string;
    title?: Nullable<string>;
    serviceItemIds?: Nullable<string[]>;
    repeatEveryKm?: Nullable<number>;
    repeatEveryMonths?: Nullable<number>;
    startsAtKm?: Nullable<number>;
    startsAtDate?: Nullable<Date>;
    notes?: Nullable<string>;
    archived?: Nullable<boolean>;
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
    bannerImageUrl?: Nullable<string>;
    dragSessions: DragSession[];
    fuelUps: FuelUp[];
    averageConsumptionLitersPerKm?: Nullable<number>;
    media: Media[];
    odometerReadings: OdometerReading[];
    upcomingServices: UpcomingService[];
    serviceItems: ServiceItem[];
    serviceLogs: ServiceLog[];
    serviceSchedules: ServiceSchedule[];
}

export interface IQuery {
    car(id: string): Nullable<Car> | Promise<Nullable<Car>>;
    cars(): Car[] | Promise<Car[]>;
    dragSession(id: string): Nullable<DragSession> | Promise<Nullable<DragSession>>;
    profile(): Nullable<Profile> | Promise<Nullable<Profile>>;
    me(): Nullable<User> | Promise<Nullable<User>>;
}

export interface IMutation {
    createCar(input: CreateCarInput): Car | Promise<Car>;
    updateCar(input: UpdateCarInput): Car | Promise<Car>;
    uploadBannerImage(input: UploadMediaInput): UploadMediaResponse | Promise<UploadMediaResponse>;
    createDragSession(input: CreateDragSessionInput): DragSession | Promise<DragSession>;
    createDragResult(input: CreateDragResultInput): DragResult | Promise<DragResult>;
    createFuelUp(input: CreateFuelUpInput): FuelUp | Promise<FuelUp>;
    updateFuelUp(input: UpdateFuelUpInput): FuelUp | Promise<FuelUp>;
    uploadMedia(input: UploadMediaInput): UploadMediaResponse | Promise<UploadMediaResponse>;
    createOdometerReading(input: CreateOdometerReadingInput): OdometerReading | Promise<OdometerReading>;
    updateOdometerReading(input: UpdateOdometerReadingInput): OdometerReading | Promise<OdometerReading>;
    deleteOdometerReading(id: string): boolean | Promise<boolean>;
    updateProfile(input: UpdateProfileInput): Profile | Promise<Profile>;
    uploadProfilePicture(input: UploadProfilePictureInput): Profile | Promise<Profile>;
    createServiceItem(input: CreateServiceItemInput): ServiceItem | Promise<ServiceItem>;
    updateServiceItem(input: UpdateServiceItemInput): ServiceItem | Promise<ServiceItem>;
    deleteServiceItem(id: string): boolean | Promise<boolean>;
    createServiceLog(input: CreateServiceLogInput): ServiceLog | Promise<ServiceLog>;
    updateServiceLog(input: UpdateServiceLogInput): ServiceLog | Promise<ServiceLog>;
    deleteServiceLog(id: string): boolean | Promise<boolean>;
    createServiceSchedule(input: CreateServiceScheduleInput): ServiceSchedule | Promise<ServiceSchedule>;
    updateServiceSchedule(input: UpdateServiceScheduleInput): ServiceSchedule | Promise<ServiceSchedule>;
    deleteServiceSchedule(id: string): boolean | Promise<boolean>;
}

export interface DragSession {
    id: string;
    title: string;
    notes?: Nullable<string>;
    results: DragResult[];
    car: Car;
    createdAt: Date;
    updatedAt: Date;
}

export interface DragResult {
    id: string;
    unit: DragResultUnit;
    value: number;
    result: number;
    session: DragSession;
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

export interface Media {
    id: string;
    url: string;
    car: Car;
    createdAt: Date;
    updatedAt: Date;
}

export interface UploadMediaResponse {
    media: Media;
    uploadUrl: string;
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
    username?: Nullable<string>;
    firstName?: Nullable<string>;
    lastName?: Nullable<string>;
    currencyCode?: Nullable<string>;
    fuelVolumeUnit?: Nullable<FuelVolumeUnit>;
    distanceUnit?: Nullable<DistanceUnit>;
    fuelConsumptionUnit?: Nullable<FuelConsumptionUnit>;
    temperatureUnit?: Nullable<TemperatureUnit>;
    profilePictureUrl?: Nullable<string>;
    visibility: ProfileVisibility;
    createdAt: Date;
    updatedAt: Date;
}

export interface UpcomingService {
    schedule: ServiceSchedule;
    nextDueKm?: Nullable<number>;
    nextDueDate?: Nullable<Date>;
}

export interface ServiceItem {
    id: string;
    label: string;
    notes?: Nullable<string>;
    estimatedDuration?: Nullable<number>;
    defaultIntervalKm?: Nullable<number>;
    defaultIntervalMonths?: Nullable<number>;
    tags: string[];
    schedules: ServiceSchedule[];
    car: Car;
    createdAt: Date;
    updatedAt: Date;
}

export interface ServiceLog {
    id: string;
    car: Car;
    datePerformed: Date;
    odometerReading?: Nullable<OdometerReading>;
    notes?: Nullable<string>;
    items: ServiceItem[];
    schedule?: Nullable<ServiceSchedule>;
    performedBy?: Nullable<string>;
    createdAt: Date;
    updatedAt: Date;
}

export interface ServiceSchedule {
    id: string;
    title: string;
    notes?: Nullable<string>;
    repeatEveryKm?: Nullable<number>;
    repeatEveryMonths?: Nullable<number>;
    startsAtKm?: Nullable<number>;
    startsAtDate?: Nullable<Date>;
    items: ServiceItem[];
    logs: ServiceLog[];
    car: Car;
    archived: boolean;
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

export type Upload = any;
type Nullable<T> = T | null;
