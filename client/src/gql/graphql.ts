/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Date custom scalar type */
  Date: { input: any; output: any; }
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: any; output: any; }
};

export type Car = {
  __typename?: 'Car';
  averageConsumptionLitersPerKm?: Maybe<Scalars['Float']['output']>;
  bannerImageUrl?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['Date']['output'];
  dragSessions: Array<DragSession>;
  fuelUps: Array<FuelUp>;
  id: Scalars['ID']['output'];
  make?: Maybe<Scalars['String']['output']>;
  media: Array<Media>;
  model?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  odometerReadings: Array<OdometerReading>;
  owner: User;
  serviceItems: Array<ServiceItem>;
  serviceLogs: Array<ServiceLog>;
  serviceSchedules: Array<ServiceSchedule>;
  upcomingServices: Array<UpcomingService>;
  updatedAt: Scalars['Date']['output'];
  year?: Maybe<Scalars['Int']['output']>;
};

export type CreateCarInput = {
  make?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateDragResultInput = {
  notes?: InputMaybe<Scalars['String']['input']>;
  result: Scalars['Float']['input'];
  sessionId: Scalars['ID']['input'];
  unit: DragResultUnit;
  value: Scalars['Float']['input'];
};

export type CreateDragSessionInput = {
  carId: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreateFuelUpInput = {
  amountLiters: Scalars['Float']['input'];
  carId: Scalars['ID']['input'];
  cost: Scalars['Float']['input'];
  fuelCategory: FuelCategory;
  isFullTank: Scalars['Boolean']['input'];
  locationLat?: InputMaybe<Scalars['Float']['input']>;
  locationLng?: InputMaybe<Scalars['Float']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  occurredAt: Scalars['Date']['input'];
  octane?: InputMaybe<OctaneRating>;
  odometerKm?: InputMaybe<Scalars['Int']['input']>;
  station: Scalars['String']['input'];
};

export type CreateOdometerReadingInput = {
  carId: Scalars['ID']['input'];
  locationLat?: InputMaybe<Scalars['Float']['input']>;
  locationLng?: InputMaybe<Scalars['Float']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  readingKm: Scalars['Float']['input'];
};

export type CreateServiceItemInput = {
  carId: Scalars['ID']['input'];
  defaultIntervalKm?: InputMaybe<Scalars['Int']['input']>;
  defaultIntervalMonths?: InputMaybe<Scalars['Int']['input']>;
  estimatedDuration?: InputMaybe<Scalars['Int']['input']>;
  label: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type CreateServiceLogInput = {
  carId: Scalars['ID']['input'];
  datePerformed: Scalars['Date']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  odometerKm?: InputMaybe<Scalars['Int']['input']>;
  performedBy?: InputMaybe<Scalars['String']['input']>;
  scheduleId?: InputMaybe<Scalars['ID']['input']>;
  serviceItemIds: Array<Scalars['ID']['input']>;
};

export type CreateServiceScheduleInput = {
  carId: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  repeatEveryKm?: InputMaybe<Scalars['Int']['input']>;
  repeatEveryMonths?: InputMaybe<Scalars['Int']['input']>;
  serviceItemIds: Array<Scalars['ID']['input']>;
  startsAtDate?: InputMaybe<Scalars['Date']['input']>;
  startsAtKm?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
};

export enum DistanceUnit {
  Kilometers = 'Kilometers',
  Miles = 'Miles'
}

export type DragResult = {
  __typename?: 'DragResult';
  id: Scalars['ID']['output'];
  result: Scalars['Float']['output'];
  session: DragSession;
  unit: DragResultUnit;
  value: Scalars['Float']['output'];
};

export enum DragResultUnit {
  Km = 'Km',
  Kph = 'Kph'
}

export type DragSession = {
  __typename?: 'DragSession';
  car: Car;
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  results: Array<DragResult>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export enum FuelCategory {
  Diesel = 'DIESEL',
  Electric = 'ELECTRIC',
  Lpg = 'LPG',
  Other = 'OTHER',
  Petrol = 'PETROL'
}

export enum FuelConsumptionUnit {
  Kpl = 'KPL',
  Lp100K = 'LP100K',
  Mpg = 'MPG',
  MpgImperial = 'MPG_Imperial'
}

export type FuelUp = {
  __typename?: 'FuelUp';
  amountLiters: Scalars['Float']['output'];
  car: Car;
  cost: Scalars['Float']['output'];
  createdAt: Scalars['Date']['output'];
  fuelCategory: FuelCategory;
  id: Scalars['ID']['output'];
  isFullTank: Scalars['Boolean']['output'];
  locationLat?: Maybe<Scalars['Float']['output']>;
  locationLng?: Maybe<Scalars['Float']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  occurredAt: Scalars['Date']['output'];
  octane?: Maybe<OctaneRating>;
  odometerReading?: Maybe<OdometerReading>;
  station: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export enum FuelVolumeUnit {
  Gallon = 'Gallon',
  ImperialGallon = 'ImperialGallon',
  Liter = 'Liter'
}

export type Media = {
  __typename?: 'Media';
  car: Car;
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  updatedAt: Scalars['Date']['output'];
  url: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCar: Car;
  createDragResult: DragResult;
  createDragSession: DragSession;
  createFuelUp: FuelUp;
  createOdometerReading: OdometerReading;
  createServiceItem: ServiceItem;
  createServiceLog: ServiceLog;
  createServiceSchedule: ServiceSchedule;
  deleteOdometerReading: Scalars['Boolean']['output'];
  deleteServiceItem: Scalars['Boolean']['output'];
  deleteServiceLog: Scalars['Boolean']['output'];
  deleteServiceSchedule: Scalars['Boolean']['output'];
  updateCar: Car;
  updateFuelUp: FuelUp;
  updateOdometerReading: OdometerReading;
  updateProfile: Profile;
  updateServiceItem: ServiceItem;
  updateServiceLog: ServiceLog;
  updateServiceSchedule: ServiceSchedule;
  uploadBannerImage: UploadMediaResponse;
  uploadMedia: UploadMediaResponse;
  uploadProfilePicture: Profile;
};


export type MutationCreateCarArgs = {
  input: CreateCarInput;
};


export type MutationCreateDragResultArgs = {
  input: CreateDragResultInput;
};


export type MutationCreateDragSessionArgs = {
  input: CreateDragSessionInput;
};


export type MutationCreateFuelUpArgs = {
  input: CreateFuelUpInput;
};


export type MutationCreateOdometerReadingArgs = {
  input: CreateOdometerReadingInput;
};


export type MutationCreateServiceItemArgs = {
  input: CreateServiceItemInput;
};


export type MutationCreateServiceLogArgs = {
  input: CreateServiceLogInput;
};


export type MutationCreateServiceScheduleArgs = {
  input: CreateServiceScheduleInput;
};


export type MutationDeleteOdometerReadingArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteServiceItemArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteServiceLogArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteServiceScheduleArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateCarArgs = {
  input: UpdateCarInput;
};


export type MutationUpdateFuelUpArgs = {
  input: UpdateFuelUpInput;
};


export type MutationUpdateOdometerReadingArgs = {
  input: UpdateOdometerReadingInput;
};


export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};


export type MutationUpdateServiceItemArgs = {
  input: UpdateServiceItemInput;
};


export type MutationUpdateServiceLogArgs = {
  input: UpdateServiceLogInput;
};


export type MutationUpdateServiceScheduleArgs = {
  input: UpdateServiceScheduleInput;
};


export type MutationUploadBannerImageArgs = {
  input: UploadMediaInput;
};


export type MutationUploadMediaArgs = {
  input: UploadMediaInput;
};


export type MutationUploadProfilePictureArgs = {
  input: UploadProfilePictureInput;
};

export enum OctaneRating {
  E85 = 'E85',
  Race = 'RACE',
  Ron91 = 'RON91',
  Ron95 = 'RON95',
  Ron98 = 'RON98',
  Ron100 = 'RON100'
}

export type OdometerReading = {
  __typename?: 'OdometerReading';
  car: Car;
  carId: Scalars['ID']['output'];
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  locationLat?: Maybe<Scalars['Float']['output']>;
  locationLng?: Maybe<Scalars['Float']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  readingKm: Scalars['Float']['output'];
  updatedAt: Scalars['Date']['output'];
};

export type Profile = {
  __typename?: 'Profile';
  createdAt: Scalars['Date']['output'];
  currencyCode?: Maybe<Scalars['String']['output']>;
  distanceUnit?: Maybe<DistanceUnit>;
  firstName?: Maybe<Scalars['String']['output']>;
  fuelConsumptionUnit?: Maybe<FuelConsumptionUnit>;
  fuelVolumeUnit?: Maybe<FuelVolumeUnit>;
  id: Scalars['ID']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  profilePictureUrl?: Maybe<Scalars['String']['output']>;
  temperatureUnit?: Maybe<TemperatureUnit>;
  updatedAt: Scalars['Date']['output'];
  username?: Maybe<Scalars['String']['output']>;
  visibility: ProfileVisibility;
};

export enum ProfileVisibility {
  Private = 'Private',
  Public = 'Public'
}

export type Query = {
  __typename?: 'Query';
  car?: Maybe<Car>;
  cars: Array<Car>;
  dragSession?: Maybe<DragSession>;
  me?: Maybe<User>;
  profile?: Maybe<Profile>;
};


export type QueryCarArgs = {
  id: Scalars['ID']['input'];
};


export type QueryDragSessionArgs = {
  id: Scalars['ID']['input'];
};

export type ServiceItem = {
  __typename?: 'ServiceItem';
  car: Car;
  createdAt: Scalars['Date']['output'];
  defaultIntervalKm?: Maybe<Scalars['Int']['output']>;
  defaultIntervalMonths?: Maybe<Scalars['Int']['output']>;
  estimatedDuration?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  label: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  schedules: Array<ServiceSchedule>;
  tags: Array<Scalars['String']['output']>;
  updatedAt: Scalars['Date']['output'];
};

export type ServiceLog = {
  __typename?: 'ServiceLog';
  car: Car;
  createdAt: Scalars['Date']['output'];
  datePerformed: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  items: Array<ServiceItem>;
  notes?: Maybe<Scalars['String']['output']>;
  odometerReading?: Maybe<OdometerReading>;
  performedBy?: Maybe<Scalars['String']['output']>;
  schedule?: Maybe<ServiceSchedule>;
  updatedAt: Scalars['Date']['output'];
};

export type ServiceSchedule = {
  __typename?: 'ServiceSchedule';
  archived: Scalars['Boolean']['output'];
  car: Car;
  createdAt: Scalars['Date']['output'];
  id: Scalars['ID']['output'];
  items: Array<ServiceItem>;
  logs: Array<ServiceLog>;
  notes?: Maybe<Scalars['String']['output']>;
  repeatEveryKm?: Maybe<Scalars['Int']['output']>;
  repeatEveryMonths?: Maybe<Scalars['Int']['output']>;
  startsAtDate?: Maybe<Scalars['Date']['output']>;
  startsAtKm?: Maybe<Scalars['Int']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['Date']['output'];
};

export enum TemperatureUnit {
  Celsius = 'Celsius',
  Fahrenheit = 'Fahrenheit'
}

export type UpcomingService = {
  __typename?: 'UpcomingService';
  nextDueDate?: Maybe<Scalars['Date']['output']>;
  nextDueKm?: Maybe<Scalars['Int']['output']>;
  schedule: ServiceSchedule;
};

export type UpdateCarInput = {
  id: Scalars['ID']['input'];
  make?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateFuelUpInput = {
  amountLiters?: InputMaybe<Scalars['Float']['input']>;
  cost?: InputMaybe<Scalars['Float']['input']>;
  fuelCategory?: InputMaybe<FuelCategory>;
  id: Scalars['ID']['input'];
  isFullTank?: InputMaybe<Scalars['Boolean']['input']>;
  locationLat?: InputMaybe<Scalars['Float']['input']>;
  locationLng?: InputMaybe<Scalars['Float']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  occurredAt?: InputMaybe<Scalars['Date']['input']>;
  octane?: InputMaybe<OctaneRating>;
  odometerKm?: InputMaybe<Scalars['Int']['input']>;
  station?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateOdometerReadingInput = {
  id: Scalars['ID']['input'];
  locationLat?: InputMaybe<Scalars['Float']['input']>;
  locationLng?: InputMaybe<Scalars['Float']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  readingKm?: InputMaybe<Scalars['Float']['input']>;
};

export type UpdateProfileInput = {
  currencyCode?: InputMaybe<Scalars['String']['input']>;
  distanceUnit?: InputMaybe<DistanceUnit>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  fuelConsumptionUnit?: InputMaybe<FuelConsumptionUnit>;
  fuelVolumeUnit?: InputMaybe<FuelVolumeUnit>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  temperatureUnit?: InputMaybe<TemperatureUnit>;
  username?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateServiceItemInput = {
  defaultIntervalKm?: InputMaybe<Scalars['Int']['input']>;
  defaultIntervalMonths?: InputMaybe<Scalars['Int']['input']>;
  estimatedDuration?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  label?: InputMaybe<Scalars['String']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UpdateServiceLogInput = {
  datePerformed?: InputMaybe<Scalars['Date']['input']>;
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  odometerKm?: InputMaybe<Scalars['Int']['input']>;
  performedBy?: InputMaybe<Scalars['String']['input']>;
  scheduleId?: InputMaybe<Scalars['ID']['input']>;
  serviceItemIds?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type UpdateServiceScheduleInput = {
  archived?: InputMaybe<Scalars['Boolean']['input']>;
  id: Scalars['ID']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  repeatEveryKm?: InputMaybe<Scalars['Int']['input']>;
  repeatEveryMonths?: InputMaybe<Scalars['Int']['input']>;
  serviceItemIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  startsAtDate?: InputMaybe<Scalars['Date']['input']>;
  startsAtKm?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UploadMediaInput = {
  carId: Scalars['ID']['input'];
};

export type UploadMediaResponse = {
  __typename?: 'UploadMediaResponse';
  media: Media;
  uploadUrl: Scalars['String']['output'];
};

export type UploadProfilePictureInput = {
  picture: Scalars['Upload']['input'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['Date']['output'];
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  profile?: Maybe<Profile>;
  updatedAt: Scalars['Date']['output'];
};

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, email: string } | null };

export type GetMeNavbarQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeNavbarQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, email: string, profile?: { __typename?: 'Profile', id: string, username?: string | null, profilePictureUrl?: string | null } | null } | null };

export type GetCarBannerQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetCarBannerQuery = { __typename?: 'Query', car?: { __typename?: 'Car', id: string, name: string, bannerImageUrl?: string | null } | null };

export type UploadBannerImageMutationVariables = Exact<{
  input: UploadMediaInput;
}>;


export type UploadBannerImageMutation = { __typename?: 'Mutation', uploadBannerImage: { __typename?: 'UploadMediaResponse', uploadUrl: string, media: { __typename?: 'Media', id: string } } };

export type GetFuelUpsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetFuelUpsQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, profile?: { __typename?: 'Profile', fuelConsumptionUnit?: FuelConsumptionUnit | null, currencyCode?: string | null, distanceUnit?: DistanceUnit | null, fuelVolumeUnit?: FuelVolumeUnit | null } | null } | null, car?: { __typename?: 'Car', id: string, averageConsumptionLitersPerKm?: number | null, fuelUps: Array<{ __typename?: 'FuelUp', id: string, occurredAt: any, station: string, amountLiters: number, cost: number, fuelCategory: FuelCategory, octane?: OctaneRating | null, notes?: string | null, isFullTank: boolean, locationLat?: number | null, locationLng?: number | null, odometerReading?: { __typename?: 'OdometerReading', id: string, readingKm: number } | null }> } | null };

export type CreateFuelUpMutationVariables = Exact<{
  input: CreateFuelUpInput;
}>;


export type CreateFuelUpMutation = { __typename?: 'Mutation', createFuelUp: { __typename?: 'FuelUp', id: string, occurredAt: any, station: string, amountLiters: number, cost: number, fuelCategory: FuelCategory, octane?: OctaneRating | null, notes?: string | null, isFullTank: boolean, locationLat?: number | null, locationLng?: number | null, odometerReading?: { __typename?: 'OdometerReading', id: string, readingKm: number } | null } };

export type GetOdometerReadingsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetOdometerReadingsQuery = { __typename?: 'Query', car?: { __typename?: 'Car', id: string, odometerReadings: Array<{ __typename?: 'OdometerReading', id: string, readingKm: number, createdAt: any, notes?: string | null }> } | null };

export type CreateOdometerReadingMutationVariables = Exact<{
  input: CreateOdometerReadingInput;
}>;


export type CreateOdometerReadingMutation = { __typename?: 'Mutation', createOdometerReading: { __typename?: 'OdometerReading', id: string, readingKm: number, createdAt: any, notes?: string | null } };

export type GetUpcomingServicesQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUpcomingServicesQuery = { __typename?: 'Query', car?: { __typename?: 'Car', upcomingServices: Array<{ __typename?: 'UpcomingService', nextDueKm?: number | null, nextDueDate?: any | null, schedule: { __typename?: 'ServiceSchedule', id: string, title: string, notes?: string | null, repeatEveryKm?: number | null, repeatEveryMonths?: number | null, startsAtKm?: number | null, startsAtDate?: any | null, archived: boolean, createdAt: any, updatedAt: any, items: Array<{ __typename?: 'ServiceItem', id: string, label: string, notes?: string | null, estimatedDuration?: number | null, defaultIntervalKm?: number | null, defaultIntervalMonths?: number | null, tags: Array<string>, createdAt: any, updatedAt: any }> } }> } | null };

export type GetServiceItemsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetServiceItemsQuery = { __typename?: 'Query', car?: { __typename?: 'Car', serviceItems: Array<{ __typename?: 'ServiceItem', id: string, label: string, notes?: string | null, estimatedDuration?: number | null, defaultIntervalKm?: number | null, defaultIntervalMonths?: number | null, tags: Array<string>, createdAt: any, updatedAt: any }> } | null };

export type CreateServiceItemMutationVariables = Exact<{
  input: CreateServiceItemInput;
}>;


export type CreateServiceItemMutation = { __typename?: 'Mutation', createServiceItem: { __typename?: 'ServiceItem', id: string, label: string, notes?: string | null, estimatedDuration?: number | null, defaultIntervalKm?: number | null, defaultIntervalMonths?: number | null, tags: Array<string>, createdAt: any, updatedAt: any } };

export type GetServiceLogsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetServiceLogsQuery = { __typename?: 'Query', car?: { __typename?: 'Car', serviceLogs: Array<{ __typename?: 'ServiceLog', id: string, datePerformed: any, notes?: string | null, performedBy?: string | null, createdAt: any, updatedAt: any, odometerReading?: { __typename?: 'OdometerReading', id: string, readingKm: number, notes?: string | null, createdAt: any, updatedAt: any } | null, items: Array<{ __typename?: 'ServiceItem', id: string, label: string, notes?: string | null, estimatedDuration?: number | null, defaultIntervalKm?: number | null, defaultIntervalMonths?: number | null, tags: Array<string>, createdAt: any, updatedAt: any }>, schedule?: { __typename?: 'ServiceSchedule', id: string, title: string, notes?: string | null, repeatEveryKm?: number | null, repeatEveryMonths?: number | null, startsAtKm?: number | null, startsAtDate?: any | null, archived: boolean, createdAt: any, updatedAt: any } | null }> } | null };

export type GetServiceSchedulesQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetServiceSchedulesQuery = { __typename?: 'Query', car?: { __typename?: 'Car', serviceSchedules: Array<{ __typename?: 'ServiceSchedule', id: string, title: string, notes?: string | null, repeatEveryKm?: number | null, repeatEveryMonths?: number | null, startsAtKm?: number | null, startsAtDate?: any | null, archived: boolean, createdAt: any, updatedAt: any, items: Array<{ __typename?: 'ServiceItem', id: string, label: string, notes?: string | null, estimatedDuration?: number | null, defaultIntervalKm?: number | null, defaultIntervalMonths?: number | null, tags: Array<string>, createdAt: any, updatedAt: any }> }> } | null };

export type CreateServiceLogMutationVariables = Exact<{
  input: CreateServiceLogInput;
}>;


export type CreateServiceLogMutation = { __typename?: 'Mutation', createServiceLog: { __typename?: 'ServiceLog', id: string, datePerformed: any, notes?: string | null, performedBy?: string | null, createdAt: any, updatedAt: any, odometerReading?: { __typename?: 'OdometerReading', id: string, readingKm: number, notes?: string | null, createdAt: any, updatedAt: any } | null, items: Array<{ __typename?: 'ServiceItem', id: string, label: string, notes?: string | null, estimatedDuration?: number | null, defaultIntervalKm?: number | null, defaultIntervalMonths?: number | null, tags: Array<string>, createdAt: any, updatedAt: any }>, schedule?: { __typename?: 'ServiceSchedule', id: string, title: string, notes?: string | null, repeatEveryKm?: number | null, repeatEveryMonths?: number | null, startsAtKm?: number | null, startsAtDate?: any | null, archived: boolean, createdAt: any, updatedAt: any } | null } };

export type CreateServiceScheduleMutationVariables = Exact<{
  input: CreateServiceScheduleInput;
}>;


export type CreateServiceScheduleMutation = { __typename?: 'Mutation', createServiceSchedule: { __typename?: 'ServiceSchedule', id: string, title: string, notes?: string | null, repeatEveryKm?: number | null, repeatEveryMonths?: number | null, startsAtKm?: number | null, startsAtDate?: any | null, archived: boolean, createdAt: any, updatedAt: any, items: Array<{ __typename?: 'ServiceItem', id: string, label: string, notes?: string | null, estimatedDuration?: number | null, defaultIntervalKm?: number | null, defaultIntervalMonths?: number | null, tags: Array<string>, createdAt: any, updatedAt: any }> } };

export type CreateDragSessionMutationVariables = Exact<{
  input: CreateDragSessionInput;
}>;


export type CreateDragSessionMutation = { __typename?: 'Mutation', createDragSession: { __typename?: 'DragSession', id: string, title: string, notes?: string | null } };

export type GetDragSessionsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetDragSessionsQuery = { __typename?: 'Query', car?: { __typename?: 'Car', id: string, dragSessions: Array<{ __typename?: 'DragSession', id: string, title: string, notes?: string | null, results: Array<{ __typename?: 'DragResult', id: string }> }> } | null };

export type GetDragSessionQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetDragSessionQuery = { __typename?: 'Query', dragSession?: { __typename?: 'DragSession', id: string, title: string, notes?: string | null, results: Array<{ __typename?: 'DragResult', id: string, unit: DragResultUnit, value: number, result: number }> } | null };

export type CreateDragResultMutationVariables = Exact<{
  input: CreateDragResultInput;
}>;


export type CreateDragResultMutation = { __typename?: 'Mutation', createDragResult: { __typename?: 'DragResult', id: string, unit: DragResultUnit, value: number, result: number } };

export type GetProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProfileQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, profile?: { __typename?: 'Profile', id: string, username?: string | null, firstName?: string | null, lastName?: string | null, currencyCode?: string | null, fuelVolumeUnit?: FuelVolumeUnit | null, distanceUnit?: DistanceUnit | null, fuelConsumptionUnit?: FuelConsumptionUnit | null, temperatureUnit?: TemperatureUnit | null, profilePictureUrl?: string | null } | null } | null };

export type UpdateProfileMutationVariables = Exact<{
  input: UpdateProfileInput;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'Profile', id: string, username?: string | null, firstName?: string | null, lastName?: string | null, currencyCode?: string | null, fuelVolumeUnit?: FuelVolumeUnit | null, distanceUnit?: DistanceUnit | null, fuelConsumptionUnit?: FuelConsumptionUnit | null, temperatureUnit?: TemperatureUnit | null } };

export type UploadProfilePictureMutationVariables = Exact<{
  input: UploadProfilePictureInput;
}>;


export type UploadProfilePictureMutation = { __typename?: 'Mutation', uploadProfilePicture: { __typename?: 'Profile', id: string, profilePictureUrl?: string | null } };

export type GetGalleryQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetGalleryQuery = { __typename?: 'Query', car?: { __typename?: 'Car', id: string, media: Array<{ __typename?: 'Media', id: string, url: string, createdAt: any, updatedAt: any }> } | null };

export type UploadMediaMutationVariables = Exact<{
  input: UploadMediaInput;
}>;


export type UploadMediaMutation = { __typename?: 'Mutation', uploadMedia: { __typename?: 'UploadMediaResponse', uploadUrl: string, media: { __typename?: 'Media', id: string, url: string, createdAt: any, updatedAt: any } } };

export type CreateCarMutationVariables = Exact<{
  input: CreateCarInput;
}>;


export type CreateCarMutation = { __typename?: 'Mutation', createCar: { __typename?: 'Car', id: string } };

export type GetGarageQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGarageQuery = { __typename?: 'Query', cars: Array<{ __typename?: 'Car', id: string, name: string, bannerImageUrl?: string | null }> };


export const GetMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<GetMeQuery, GetMeQueryVariables>;
export const GetMeNavbarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeNavbar"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}}]}}]}}]} as unknown as DocumentNode<GetMeNavbarQuery, GetMeNavbarQueryVariables>;
export const GetCarBannerDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCarBanner"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"car"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"bannerImageUrl"}}]}}]}}]} as unknown as DocumentNode<GetCarBannerQuery, GetCarBannerQueryVariables>;
export const UploadBannerImageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UploadBannerImage"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UploadMediaInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadBannerImage"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}},{"kind":"Field","name":{"kind":"Name","value":"uploadUrl"}}]}}]}}]} as unknown as DocumentNode<UploadBannerImageMutation, UploadBannerImageMutationVariables>;
export const GetFuelUpsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFuelUps"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"fuelConsumptionUnit"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"distanceUnit"}},{"kind":"Field","name":{"kind":"Name","value":"fuelVolumeUnit"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"car"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fuelUps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"occurredAt"}},{"kind":"Field","name":{"kind":"Name","value":"station"}},{"kind":"Field","name":{"kind":"Name","value":"amountLiters"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}},{"kind":"Field","name":{"kind":"Name","value":"fuelCategory"}},{"kind":"Field","name":{"kind":"Name","value":"octane"}},{"kind":"Field","name":{"kind":"Name","value":"odometerReading"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"readingKm"}}]}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"isFullTank"}},{"kind":"Field","name":{"kind":"Name","value":"locationLat"}},{"kind":"Field","name":{"kind":"Name","value":"locationLng"}}]}},{"kind":"Field","name":{"kind":"Name","value":"averageConsumptionLitersPerKm"}}]}}]}}]} as unknown as DocumentNode<GetFuelUpsQuery, GetFuelUpsQueryVariables>;
export const CreateFuelUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateFuelUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateFuelUpInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createFuelUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"occurredAt"}},{"kind":"Field","name":{"kind":"Name","value":"station"}},{"kind":"Field","name":{"kind":"Name","value":"amountLiters"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}},{"kind":"Field","name":{"kind":"Name","value":"fuelCategory"}},{"kind":"Field","name":{"kind":"Name","value":"octane"}},{"kind":"Field","name":{"kind":"Name","value":"odometerReading"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"readingKm"}}]}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"isFullTank"}},{"kind":"Field","name":{"kind":"Name","value":"locationLat"}},{"kind":"Field","name":{"kind":"Name","value":"locationLng"}}]}}]}}]} as unknown as DocumentNode<CreateFuelUpMutation, CreateFuelUpMutationVariables>;
export const GetOdometerReadingsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOdometerReadings"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"car"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"odometerReadings"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"readingKm"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]}}]} as unknown as DocumentNode<GetOdometerReadingsQuery, GetOdometerReadingsQueryVariables>;
export const CreateOdometerReadingDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOdometerReading"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOdometerReadingInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOdometerReading"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"readingKm"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]} as unknown as DocumentNode<CreateOdometerReadingMutation, CreateOdometerReadingMutationVariables>;
export const GetUpcomingServicesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUpcomingServices"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"car"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upcomingServices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nextDueKm"}},{"kind":"Field","name":{"kind":"Name","value":"nextDueDate"}},{"kind":"Field","name":{"kind":"Name","value":"schedule"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedDuration"}},{"kind":"Field","name":{"kind":"Name","value":"defaultIntervalKm"}},{"kind":"Field","name":{"kind":"Name","value":"defaultIntervalMonths"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"repeatEveryKm"}},{"kind":"Field","name":{"kind":"Name","value":"repeatEveryMonths"}},{"kind":"Field","name":{"kind":"Name","value":"startsAtKm"}},{"kind":"Field","name":{"kind":"Name","value":"startsAtDate"}},{"kind":"Field","name":{"kind":"Name","value":"archived"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetUpcomingServicesQuery, GetUpcomingServicesQueryVariables>;
export const GetServiceItemsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetServiceItems"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"car"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"serviceItems"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedDuration"}},{"kind":"Field","name":{"kind":"Name","value":"defaultIntervalKm"}},{"kind":"Field","name":{"kind":"Name","value":"defaultIntervalMonths"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetServiceItemsQuery, GetServiceItemsQueryVariables>;
export const CreateServiceItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateServiceItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateServiceItemInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createServiceItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedDuration"}},{"kind":"Field","name":{"kind":"Name","value":"defaultIntervalKm"}},{"kind":"Field","name":{"kind":"Name","value":"defaultIntervalMonths"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateServiceItemMutation, CreateServiceItemMutationVariables>;
export const GetServiceLogsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetServiceLogs"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"car"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"serviceLogs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"datePerformed"}},{"kind":"Field","name":{"kind":"Name","value":"odometerReading"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"readingKm"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedDuration"}},{"kind":"Field","name":{"kind":"Name","value":"defaultIntervalKm"}},{"kind":"Field","name":{"kind":"Name","value":"defaultIntervalMonths"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schedule"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"repeatEveryKm"}},{"kind":"Field","name":{"kind":"Name","value":"repeatEveryMonths"}},{"kind":"Field","name":{"kind":"Name","value":"startsAtKm"}},{"kind":"Field","name":{"kind":"Name","value":"startsAtDate"}},{"kind":"Field","name":{"kind":"Name","value":"archived"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"performedBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetServiceLogsQuery, GetServiceLogsQueryVariables>;
export const GetServiceSchedulesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetServiceSchedules"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"car"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"serviceSchedules"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedDuration"}},{"kind":"Field","name":{"kind":"Name","value":"defaultIntervalKm"}},{"kind":"Field","name":{"kind":"Name","value":"defaultIntervalMonths"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"repeatEveryKm"}},{"kind":"Field","name":{"kind":"Name","value":"repeatEveryMonths"}},{"kind":"Field","name":{"kind":"Name","value":"startsAtKm"}},{"kind":"Field","name":{"kind":"Name","value":"startsAtDate"}},{"kind":"Field","name":{"kind":"Name","value":"archived"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetServiceSchedulesQuery, GetServiceSchedulesQueryVariables>;
export const CreateServiceLogDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateServiceLog"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateServiceLogInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createServiceLog"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"datePerformed"}},{"kind":"Field","name":{"kind":"Name","value":"odometerReading"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"readingKm"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedDuration"}},{"kind":"Field","name":{"kind":"Name","value":"defaultIntervalKm"}},{"kind":"Field","name":{"kind":"Name","value":"defaultIntervalMonths"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"schedule"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"repeatEveryKm"}},{"kind":"Field","name":{"kind":"Name","value":"repeatEveryMonths"}},{"kind":"Field","name":{"kind":"Name","value":"startsAtKm"}},{"kind":"Field","name":{"kind":"Name","value":"startsAtDate"}},{"kind":"Field","name":{"kind":"Name","value":"archived"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"performedBy"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateServiceLogMutation, CreateServiceLogMutationVariables>;
export const CreateServiceScheduleDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateServiceSchedule"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateServiceScheduleInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createServiceSchedule"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"items"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"label"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"estimatedDuration"}},{"kind":"Field","name":{"kind":"Name","value":"defaultIntervalKm"}},{"kind":"Field","name":{"kind":"Name","value":"defaultIntervalMonths"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"repeatEveryKm"}},{"kind":"Field","name":{"kind":"Name","value":"repeatEveryMonths"}},{"kind":"Field","name":{"kind":"Name","value":"startsAtKm"}},{"kind":"Field","name":{"kind":"Name","value":"startsAtDate"}},{"kind":"Field","name":{"kind":"Name","value":"archived"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateServiceScheduleMutation, CreateServiceScheduleMutationVariables>;
export const CreateDragSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDragSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDragSessionInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDragSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]} as unknown as DocumentNode<CreateDragSessionMutation, CreateDragSessionMutationVariables>;
export const GetDragSessionsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDragSessions"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"car"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"dragSessions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetDragSessionsQuery, GetDragSessionsQueryVariables>;
export const GetDragSessionDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetDragSession"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"dragSession"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"result"}}]}}]}}]}}]} as unknown as DocumentNode<GetDragSessionQuery, GetDragSessionQueryVariables>;
export const CreateDragResultDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateDragResult"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateDragResultInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createDragResult"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"unit"}},{"kind":"Field","name":{"kind":"Name","value":"value"}},{"kind":"Field","name":{"kind":"Name","value":"result"}}]}}]}}]} as unknown as DocumentNode<CreateDragResultMutation, CreateDragResultMutationVariables>;
export const GetProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProfile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"fuelVolumeUnit"}},{"kind":"Field","name":{"kind":"Name","value":"distanceUnit"}},{"kind":"Field","name":{"kind":"Name","value":"fuelConsumptionUnit"}},{"kind":"Field","name":{"kind":"Name","value":"temperatureUnit"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}}]}}]}}]} as unknown as DocumentNode<GetProfileQuery, GetProfileQueryVariables>;
export const UpdateProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateProfileInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}},{"kind":"Field","name":{"kind":"Name","value":"firstName"}},{"kind":"Field","name":{"kind":"Name","value":"lastName"}},{"kind":"Field","name":{"kind":"Name","value":"currencyCode"}},{"kind":"Field","name":{"kind":"Name","value":"fuelVolumeUnit"}},{"kind":"Field","name":{"kind":"Name","value":"distanceUnit"}},{"kind":"Field","name":{"kind":"Name","value":"fuelConsumptionUnit"}},{"kind":"Field","name":{"kind":"Name","value":"temperatureUnit"}}]}}]}}]} as unknown as DocumentNode<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const UploadProfilePictureDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UploadProfilePicture"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UploadProfilePictureInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadProfilePicture"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"profilePictureUrl"}}]}}]}}]} as unknown as DocumentNode<UploadProfilePictureMutation, UploadProfilePictureMutationVariables>;
export const GetGalleryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGallery"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"car"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetGalleryQuery, GetGalleryQueryVariables>;
export const UploadMediaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UploadMedia"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UploadMediaInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadMedia"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"uploadUrl"}}]}}]}}]} as unknown as DocumentNode<UploadMediaMutation, UploadMediaMutationVariables>;
export const CreateCarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCarInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCar"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateCarMutation, CreateCarMutationVariables>;
export const GetGarageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGarage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cars"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"bannerImageUrl"}}]}}]}}]} as unknown as DocumentNode<GetGarageQuery, GetGarageQueryVariables>;