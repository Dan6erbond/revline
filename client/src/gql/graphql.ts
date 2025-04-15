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
};

export type Car = {
  __typename?: 'Car';
  fuelUps: Array<FuelUp>;
  id: Scalars['ID']['output'];
  make?: Maybe<Scalars['String']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  owner: User;
  year?: Maybe<Scalars['Int']['output']>;
};

export type CreateCarInput = {
  make?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateFuelUpInput = {
  amount: Scalars['Float']['input'];
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

export enum FuelCategory {
  Diesel = 'DIESEL',
  Electric = 'ELECTRIC',
  Lpg = 'LPG',
  Other = 'OTHER',
  Petrol = 'PETROL'
}

export type FuelUp = {
  __typename?: 'FuelUp';
  amount: Scalars['Float']['output'];
  car: Car;
  cost: Scalars['Float']['output'];
  fuelCategory: FuelCategory;
  id: Scalars['ID']['output'];
  isFullTank: Scalars['Boolean']['output'];
  locationLat?: Maybe<Scalars['Float']['output']>;
  locationLng?: Maybe<Scalars['Float']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  occurredAt: Scalars['Date']['output'];
  octane?: Maybe<OctaneRating>;
  odometerKm?: Maybe<Scalars['Int']['output']>;
  station: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCar: Car;
  createFuelUp: FuelUp;
  updateCar: Car;
  updateFuelUp: FuelUp;
};


export type MutationCreateCarArgs = {
  input: CreateCarInput;
};


export type MutationCreateFuelUpArgs = {
  input: CreateFuelUpInput;
};


export type MutationUpdateCarArgs = {
  input: UpdateCarInput;
};


export type MutationUpdateFuelUpArgs = {
  input: UpdateFuelUpInput;
};

export enum OctaneRating {
  E85 = 'E85',
  Race = 'RACE',
  Ron91 = 'RON91',
  Ron95 = 'RON95',
  Ron98 = 'RON98',
  Ron100 = 'RON100'
}

export type Profile = {
  __typename?: 'Profile';
  id: Scalars['ID']['output'];
  username: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  car?: Maybe<Car>;
  cars: Array<Car>;
  me?: Maybe<User>;
  profile?: Maybe<Profile>;
};


export type QueryCarArgs = {
  id: Scalars['ID']['input'];
};

export type UpdateCarInput = {
  id: Scalars['ID']['input'];
  make?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateFuelUpInput = {
  amount?: InputMaybe<Scalars['Float']['input']>;
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

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  profile?: Maybe<Profile>;
};

export type GetMeQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, email: string } | null };

export type GetMeNavbarQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMeNavbarQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: string, email: string, profile?: { __typename?: 'Profile', id: string, username: string } | null } | null };

export type GetFuelUpsQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetFuelUpsQuery = { __typename?: 'Query', car?: { __typename?: 'Car', id: string, fuelUps: Array<{ __typename?: 'FuelUp', id: string, occurredAt: any, station: string, amount: number, cost: number, fuelCategory: FuelCategory, octane?: OctaneRating | null, odometerKm?: number | null, notes?: string | null, isFullTank: boolean, locationLat?: number | null, locationLng?: number | null }> } | null };

export type CreateFuelUpMutationVariables = Exact<{
  input: CreateFuelUpInput;
}>;


export type CreateFuelUpMutation = { __typename?: 'Mutation', createFuelUp: { __typename?: 'FuelUp', id: string, occurredAt: any, station: string, amount: number, cost: number, fuelCategory: FuelCategory, octane?: OctaneRating | null, odometerKm?: number | null, notes?: string | null, isFullTank: boolean, locationLat?: number | null, locationLng?: number | null } };

export type CreateCarMutationVariables = Exact<{
  input: CreateCarInput;
}>;


export type CreateCarMutation = { __typename?: 'Mutation', createCar: { __typename?: 'Car', id: string } };

export type GetGarageQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGarageQuery = { __typename?: 'Query', cars: Array<{ __typename?: 'Car', id: string, name: string, make?: string | null, model?: string | null, year?: number | null }> };


export const GetMeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMe"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]} as unknown as DocumentNode<GetMeQuery, GetMeQueryVariables>;
export const GetMeNavbarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetMeNavbar"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"profile"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"username"}}]}}]}}]}}]} as unknown as DocumentNode<GetMeNavbarQuery, GetMeNavbarQueryVariables>;
export const GetFuelUpsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetFuelUps"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"car"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"fuelUps"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"occurredAt"}},{"kind":"Field","name":{"kind":"Name","value":"station"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}},{"kind":"Field","name":{"kind":"Name","value":"fuelCategory"}},{"kind":"Field","name":{"kind":"Name","value":"octane"}},{"kind":"Field","name":{"kind":"Name","value":"odometerKm"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"isFullTank"}},{"kind":"Field","name":{"kind":"Name","value":"locationLat"}},{"kind":"Field","name":{"kind":"Name","value":"locationLng"}}]}}]}}]}}]} as unknown as DocumentNode<GetFuelUpsQuery, GetFuelUpsQueryVariables>;
export const CreateFuelUpDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateFuelUp"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateFuelUpInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createFuelUp"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"occurredAt"}},{"kind":"Field","name":{"kind":"Name","value":"station"}},{"kind":"Field","name":{"kind":"Name","value":"amount"}},{"kind":"Field","name":{"kind":"Name","value":"cost"}},{"kind":"Field","name":{"kind":"Name","value":"fuelCategory"}},{"kind":"Field","name":{"kind":"Name","value":"octane"}},{"kind":"Field","name":{"kind":"Name","value":"odometerKm"}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"isFullTank"}},{"kind":"Field","name":{"kind":"Name","value":"locationLat"}},{"kind":"Field","name":{"kind":"Name","value":"locationLng"}}]}}]}}]} as unknown as DocumentNode<CreateFuelUpMutation, CreateFuelUpMutationVariables>;
export const CreateCarDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateCar"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateCarInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createCar"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<CreateCarMutation, CreateCarMutationVariables>;
export const GetGarageDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGarage"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cars"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"make"}},{"kind":"Field","name":{"kind":"Name","value":"model"}},{"kind":"Field","name":{"kind":"Name","value":"year"}}]}}]}}]} as unknown as DocumentNode<GetGarageQuery, GetGarageQueryVariables>;