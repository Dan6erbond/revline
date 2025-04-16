/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n            query GetMe {\n              me {\n                id\n                email\n              }\n            }\n          ": typeof types.GetMeDocument,
    "\n  query GetMeNavbar {\n    me {\n      id\n      email\n      profile {\n        id\n        username\n        profilePictureUrl\n      }\n    }\n  }\n": typeof types.GetMeNavbarDocument,
    "\n  query GetFuelUps($id: ID!) {\n    car(id: $id) {\n      id\n      fuelUps {\n        id\n        occurredAt\n        station\n        amountLiters\n        cost\n        fuelCategory\n        octane\n        odometerReading {\n          id\n          readingKm\n        }\n        notes\n        isFullTank\n        locationLat\n        locationLng\n      }\n    }\n  }\n": typeof types.GetFuelUpsDocument,
    "\n  mutation CreateFuelUp($input: CreateFuelUpInput!) {\n    createFuelUp(input: $input) {\n      id\n      occurredAt\n      station\n      amountLiters\n      cost\n      fuelCategory\n      octane\n      odometerReading {\n        id\n        readingKm\n      }\n      notes\n      isFullTank\n      locationLat\n      locationLng\n    }\n  }\n": typeof types.CreateFuelUpDocument,
    "\n  query GetOdometerReadings($id: ID!) {\n    car(id: $id) {\n      id\n      odometerReadings {\n        id\n        readingKm\n        createdAt\n        notes\n      }\n    }\n  }\n": typeof types.GetOdometerReadingsDocument,
    "\n  mutation CreateOdometerReading($input: CreateOdometerReadingInput!) {\n    createOdometerReading(input: $input) {\n      id\n      readingKm\n      createdAt\n      notes\n    }\n  }\n": typeof types.CreateOdometerReadingDocument,
    "\n  query GetProfile {\n    me {\n      id\n      profile {\n        id\n        username\n        firstName\n        lastName\n        profilePictureUrl\n      }\n    }\n  }\n": typeof types.GetProfileDocument,
    "\n  mutation UpdateProfile($input: UpdateProfileInput!) {\n    updateProfile(input: $input) {\n      id\n      username\n      firstName\n      lastName\n    }\n  }\n": typeof types.UpdateProfileDocument,
    "\n  mutation UploadProfilePicture($input: UploadProfilePictureInput!) {\n    uploadProfilePicture(input: $input) {\n      id\n      profilePictureUrl\n    }\n  }\n": typeof types.UploadProfilePictureDocument,
    "\n  mutation CreateCar($input: CreateCarInput!) {\n    createCar(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateCarDocument,
    "\n  query GetGarage {\n    cars {\n      id\n      name\n      make\n      model\n      year\n    }\n  }\n": typeof types.GetGarageDocument,
};
const documents: Documents = {
    "\n            query GetMe {\n              me {\n                id\n                email\n              }\n            }\n          ": types.GetMeDocument,
    "\n  query GetMeNavbar {\n    me {\n      id\n      email\n      profile {\n        id\n        username\n        profilePictureUrl\n      }\n    }\n  }\n": types.GetMeNavbarDocument,
    "\n  query GetFuelUps($id: ID!) {\n    car(id: $id) {\n      id\n      fuelUps {\n        id\n        occurredAt\n        station\n        amountLiters\n        cost\n        fuelCategory\n        octane\n        odometerReading {\n          id\n          readingKm\n        }\n        notes\n        isFullTank\n        locationLat\n        locationLng\n      }\n    }\n  }\n": types.GetFuelUpsDocument,
    "\n  mutation CreateFuelUp($input: CreateFuelUpInput!) {\n    createFuelUp(input: $input) {\n      id\n      occurredAt\n      station\n      amountLiters\n      cost\n      fuelCategory\n      octane\n      odometerReading {\n        id\n        readingKm\n      }\n      notes\n      isFullTank\n      locationLat\n      locationLng\n    }\n  }\n": types.CreateFuelUpDocument,
    "\n  query GetOdometerReadings($id: ID!) {\n    car(id: $id) {\n      id\n      odometerReadings {\n        id\n        readingKm\n        createdAt\n        notes\n      }\n    }\n  }\n": types.GetOdometerReadingsDocument,
    "\n  mutation CreateOdometerReading($input: CreateOdometerReadingInput!) {\n    createOdometerReading(input: $input) {\n      id\n      readingKm\n      createdAt\n      notes\n    }\n  }\n": types.CreateOdometerReadingDocument,
    "\n  query GetProfile {\n    me {\n      id\n      profile {\n        id\n        username\n        firstName\n        lastName\n        profilePictureUrl\n      }\n    }\n  }\n": types.GetProfileDocument,
    "\n  mutation UpdateProfile($input: UpdateProfileInput!) {\n    updateProfile(input: $input) {\n      id\n      username\n      firstName\n      lastName\n    }\n  }\n": types.UpdateProfileDocument,
    "\n  mutation UploadProfilePicture($input: UploadProfilePictureInput!) {\n    uploadProfilePicture(input: $input) {\n      id\n      profilePictureUrl\n    }\n  }\n": types.UploadProfilePictureDocument,
    "\n  mutation CreateCar($input: CreateCarInput!) {\n    createCar(input: $input) {\n      id\n    }\n  }\n": types.CreateCarDocument,
    "\n  query GetGarage {\n    cars {\n      id\n      name\n      make\n      model\n      year\n    }\n  }\n": types.GetGarageDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n            query GetMe {\n              me {\n                id\n                email\n              }\n            }\n          "): (typeof documents)["\n            query GetMe {\n              me {\n                id\n                email\n              }\n            }\n          "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMeNavbar {\n    me {\n      id\n      email\n      profile {\n        id\n        username\n        profilePictureUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetMeNavbar {\n    me {\n      id\n      email\n      profile {\n        id\n        username\n        profilePictureUrl\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetFuelUps($id: ID!) {\n    car(id: $id) {\n      id\n      fuelUps {\n        id\n        occurredAt\n        station\n        amountLiters\n        cost\n        fuelCategory\n        octane\n        odometerReading {\n          id\n          readingKm\n        }\n        notes\n        isFullTank\n        locationLat\n        locationLng\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetFuelUps($id: ID!) {\n    car(id: $id) {\n      id\n      fuelUps {\n        id\n        occurredAt\n        station\n        amountLiters\n        cost\n        fuelCategory\n        octane\n        odometerReading {\n          id\n          readingKm\n        }\n        notes\n        isFullTank\n        locationLat\n        locationLng\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateFuelUp($input: CreateFuelUpInput!) {\n    createFuelUp(input: $input) {\n      id\n      occurredAt\n      station\n      amountLiters\n      cost\n      fuelCategory\n      octane\n      odometerReading {\n        id\n        readingKm\n      }\n      notes\n      isFullTank\n      locationLat\n      locationLng\n    }\n  }\n"): (typeof documents)["\n  mutation CreateFuelUp($input: CreateFuelUpInput!) {\n    createFuelUp(input: $input) {\n      id\n      occurredAt\n      station\n      amountLiters\n      cost\n      fuelCategory\n      octane\n      odometerReading {\n        id\n        readingKm\n      }\n      notes\n      isFullTank\n      locationLat\n      locationLng\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetOdometerReadings($id: ID!) {\n    car(id: $id) {\n      id\n      odometerReadings {\n        id\n        readingKm\n        createdAt\n        notes\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetOdometerReadings($id: ID!) {\n    car(id: $id) {\n      id\n      odometerReadings {\n        id\n        readingKm\n        createdAt\n        notes\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateOdometerReading($input: CreateOdometerReadingInput!) {\n    createOdometerReading(input: $input) {\n      id\n      readingKm\n      createdAt\n      notes\n    }\n  }\n"): (typeof documents)["\n  mutation CreateOdometerReading($input: CreateOdometerReadingInput!) {\n    createOdometerReading(input: $input) {\n      id\n      readingKm\n      createdAt\n      notes\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetProfile {\n    me {\n      id\n      profile {\n        id\n        username\n        firstName\n        lastName\n        profilePictureUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetProfile {\n    me {\n      id\n      profile {\n        id\n        username\n        firstName\n        lastName\n        profilePictureUrl\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateProfile($input: UpdateProfileInput!) {\n    updateProfile(input: $input) {\n      id\n      username\n      firstName\n      lastName\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateProfile($input: UpdateProfileInput!) {\n    updateProfile(input: $input) {\n      id\n      username\n      firstName\n      lastName\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UploadProfilePicture($input: UploadProfilePictureInput!) {\n    uploadProfilePicture(input: $input) {\n      id\n      profilePictureUrl\n    }\n  }\n"): (typeof documents)["\n  mutation UploadProfilePicture($input: UploadProfilePictureInput!) {\n    uploadProfilePicture(input: $input) {\n      id\n      profilePictureUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCar($input: CreateCarInput!) {\n    createCar(input: $input) {\n      id\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCar($input: CreateCarInput!) {\n    createCar(input: $input) {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetGarage {\n    cars {\n      id\n      name\n      make\n      model\n      year\n    }\n  }\n"): (typeof documents)["\n  query GetGarage {\n    cars {\n      id\n      name\n      make\n      model\n      year\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;