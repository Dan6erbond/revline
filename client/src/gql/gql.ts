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
    "\n  fragment PreviewFields on Document {\n    id\n    name\n    url\n    metadata {\n      contentType\n      size\n    }\n  }\n": typeof types.PreviewFieldsFragmentDoc,
    "\n  query GetDocument($id: ID!) {\n    document(id: $id) {\n      id\n      name\n      url\n      tags\n      metadata {\n        contentType\n        size\n      }\n      ...PreviewFields\n    }\n  }\n": typeof types.GetDocumentDocument,
    "\n  query GetMeNavbar {\n    me {\n      id\n      email\n      profile {\n        id\n        username\n        pictureUrl\n      }\n    }\n  }\n": typeof types.GetMeNavbarDocument,
    "\n  query GetCarBanner($id: ID!) {\n    car(id: $id) {\n      id\n      name\n      bannerImageUrl\n    }\n  }\n": typeof types.GetCarBannerDocument,
    "\n  mutation UploadBannerImage($input: CreateMediaInput!) {\n    uploadBannerImage(input: $input) {\n      media {\n        id\n      }\n      uploadUrl\n    }\n  }\n": typeof types.UploadBannerImageDocument,
    "\n  query GetFuelUps($id: ID!) {\n    me {\n      id\n      profile {\n        id\n        fuelConsumptionUnit\n        currencyCode\n        distanceUnit\n        fuelVolumeUnit\n      }\n    }\n    car(id: $id) {\n      id\n      fuelUps {\n        id\n        occurredAt\n        station\n        amountLiters\n        cost\n        fuelCategory\n        octaneRating\n        odometerReading {\n          id\n          readingKm\n        }\n        notes\n        isFullTank\n      }\n      averageConsumptionLitersPerKm\n    }\n  }\n": typeof types.GetFuelUpsDocument,
    "\n  mutation CreateFuelUp($input: CreateFuelUpInput!) {\n    createFuelUp(input: $input) {\n      id\n      occurredAt\n      station\n      amountLiters\n      cost\n      fuelCategory\n      octaneRating\n      odometerReading {\n        id\n        readingKm\n      }\n      notes\n      isFullTank\n    }\n  }\n": typeof types.CreateFuelUpDocument,
    "\n  query GetOdometerReadings($id: ID!) {\n    me {\n      id\n      profile {\n        id\n        distanceUnit\n      }\n    }\n    car(id: $id) {\n      id\n      odometerReadings {\n        id\n        readingKm\n        createTime\n        notes\n      }\n    }\n  }\n": typeof types.GetOdometerReadingsDocument,
    "\n  mutation CreateOdometerReading($input: CreateOdometerReadingInput!) {\n    createOdometerReading(input: $input) {\n      id\n      readingKm\n      createTime\n      notes\n    }\n  }\n": typeof types.CreateOdometerReadingDocument,
    "\n  query GetUpcomingServices($id: ID!) {\n    me {\n      id\n      profile {\n        id\n        distanceUnit\n      }\n    }\n    car(id: $id) {\n      id\n      upcomingServices {\n        nextDueKm\n        nextDueDate\n        schedule {\n          id\n          title\n          notes\n          items {\n            id\n            label\n            notes\n            estimatedMinutes\n            defaultIntervalKm\n            defaultIntervalMonths\n            tags\n          }\n          repeatEveryKm\n          repeatEveryMonths\n          startsAtKm\n          startsAtMonths\n          archived\n        }\n      }\n    }\n  }\n": typeof types.GetUpcomingServicesDocument,
    "\n  query GetServiceItems($id: ID!) {\n    me {\n      id\n      profile {\n        id\n        distanceUnit\n      }\n    }\n    car(id: $id) {\n      id\n      serviceItems {\n        id\n        label\n        notes\n        estimatedMinutes\n        defaultIntervalKm\n        defaultIntervalMonths\n        tags\n      }\n    }\n  }\n": typeof types.GetServiceItemsDocument,
    "\n  mutation CreateServiceItem($input: CreateServiceItemInput!) {\n    createServiceItem(input: $input) {\n      id\n      label\n      notes\n      estimatedMinutes\n      defaultIntervalKm\n      defaultIntervalMonths\n      tags\n    }\n  }\n": typeof types.CreateServiceItemDocument,
    "\n  query GetServiceLogs($id: ID!) {\n    me {\n      id\n      profile {\n        id\n        distanceUnit\n      }\n    }\n    car(id: $id) {\n      id\n      serviceLogs {\n        id\n        datePerformed\n        odometerReading {\n          id\n          readingKm\n          notes\n        }\n        notes\n        items {\n          id\n          label\n          notes\n          estimatedMinutes\n          defaultIntervalKm\n          defaultIntervalMonths\n          tags\n        }\n        schedule {\n          id\n          title\n          notes\n          repeatEveryKm\n          repeatEveryMonths\n          startsAtKm\n          startsAtMonths\n          archived\n        }\n        performedBy\n      }\n    }\n  }\n": typeof types.GetServiceLogsDocument,
    "\n  query GetServiceSchedules($id: ID!) {\n    me {\n      id\n      profile {\n        id\n        distanceUnit\n      }\n    }\n    car(id: $id) {\n      id\n      serviceSchedules {\n        id\n        title\n        notes\n        items {\n          id\n          label\n          notes\n          estimatedMinutes\n          defaultIntervalKm\n          defaultIntervalMonths\n          tags\n        }\n        repeatEveryKm\n        repeatEveryMonths\n        startsAtKm\n        startsAtMonths\n        archived\n      }\n    }\n  }\n": typeof types.GetServiceSchedulesDocument,
    "\n  mutation CreateServiceLog($input: CreateServiceLogInput!) {\n    createServiceLog(input: $input) {\n      id\n      datePerformed\n      odometerReading {\n        id\n        readingKm\n        notes\n      }\n      notes\n      items {\n        id\n        label\n        notes\n        estimatedMinutes\n        defaultIntervalKm\n        defaultIntervalMonths\n        tags\n      }\n      schedule {\n        id\n        title\n        notes\n        repeatEveryKm\n        repeatEveryMonths\n        startsAtKm\n        startsAtMonths\n        archived\n      }\n      performedBy\n    }\n  }\n": typeof types.CreateServiceLogDocument,
    "\n  mutation CreateServiceSchedule($input: CreateServiceScheduleInput!) {\n    createServiceSchedule(input: $input) {\n      id\n      title\n      notes\n      items {\n        id\n        label\n        notes\n        estimatedMinutes\n        defaultIntervalKm\n        defaultIntervalMonths\n        tags\n      }\n      repeatEveryKm\n      repeatEveryMonths\n      startsAtKm\n      startsAtMonths\n      archived\n    }\n  }\n": typeof types.CreateServiceScheduleDocument,
    "\n  mutation CreateDragSession($input: CreateDragSessionInput!) {\n    createDragSession(input: $input) {\n      id\n      title\n      notes\n    }\n  }\n": typeof types.CreateDragSessionDocument,
    "\n  query GetDragSessions($id: ID!) {\n    car(id: $id) {\n      id\n      dragSessions {\n        id\n        title\n        notes\n        results {\n          id\n        }\n      }\n    }\n  }\n": typeof types.GetDragSessionsDocument,
    "\n  query GetDragSession($id: ID!) {\n    dragSession(id: $id) {\n      id\n      title\n      notes\n      results {\n        id\n        unit\n        value\n        result\n      }\n    }\n  }\n": typeof types.GetDragSessionDocument,
    "\n  mutation CreateDragResult($input: CreateDragResultInput!) {\n    createDragResult(input: $input) {\n      id\n      unit\n      value\n      result\n    }\n  }\n": typeof types.CreateDragResultDocument,
    "\n  mutation CreateDynoSession($input: CreateDynoSessionInput!) {\n    createDynoSession(input: $input) {\n      id\n      title\n      notes\n    }\n  }\n": typeof types.CreateDynoSessionDocument,
    "\n  query GetDynoSessions($id: ID!) {\n    car(id: $id) {\n      id\n      dynoSessions {\n        id\n        title\n        notes\n        results {\n          id\n        }\n      }\n    }\n  }\n": typeof types.GetDynoSessionsDocument,
    "\n  query GetDynoSession($id: ID!) {\n    dynoSession(id: $id) {\n      id\n      title\n      notes\n      results {\n        id\n        rpm\n        powerKw\n        torqueNm\n      }\n    }\n  }\n": typeof types.GetDynoSessionDocument,
    "\n  mutation CreateDynoResult($input: CreateDynoResultInput!) {\n    createDynoResult(input: $input) {\n      id\n      rpm\n      powerKw\n      torqueNm\n    }\n  }\n": typeof types.CreateDynoResultDocument,
    "\n  query GetProfile {\n    me {\n      id\n      profile {\n        id\n        username\n        firstName\n        lastName\n        currencyCode\n        fuelVolumeUnit\n        distanceUnit\n        fuelConsumptionUnit\n        temperatureUnit\n        pictureUrl\n      }\n    }\n  }\n": typeof types.GetProfileDocument,
    "\n  mutation UpdateProfile($input: UpdateProfileInput!) {\n    updateProfile(input: $input) {\n      id\n      username\n      firstName\n      lastName\n      currencyCode\n      fuelVolumeUnit\n      distanceUnit\n      fuelConsumptionUnit\n      temperatureUnit\n    }\n  }\n": typeof types.UpdateProfileDocument,
    "\n  mutation UploadProfilePicture($input: UploadProfilePictureInput!) {\n    uploadProfilePicture(input: $input) {\n      id\n      pictureUrl\n    }\n  }\n": typeof types.UploadProfilePictureDocument,
    "\n  query GetSubscription {\n    me {\n      id\n      subscription {\n        id\n        tier\n      }\n    }\n  }\n": typeof types.GetSubscriptionDocument,
    "\n  query GetDocuments($id: ID!) {\n    car(id: $id) {\n      id\n      documents {\n        id\n        name\n        tags\n        url\n        metadata {\n          contentType\n          size\n        }\n      }\n    }\n  }\n": typeof types.GetDocumentsDocument,
    "\n  mutation UploadDocument($input: CreateDocumentInput!) {\n    uploadDocument(input: $input) {\n      document {\n        id\n        name\n        tags\n        url\n      }\n      uploadUrl\n    }\n  }\n": typeof types.UploadDocumentDocument,
    "\n  query GetGallery($id: ID!) {\n    car(id: $id) {\n      id\n      media {\n        id\n        url\n      }\n    }\n  }\n": typeof types.GetGalleryDocument,
    "\n  mutation UploadMedia($input: CreateMediaInput!) {\n    uploadMedia(input: $input) {\n      media {\n        id\n        url\n      }\n      uploadUrl\n    }\n  }\n": typeof types.UploadMediaDocument,
    "\n  fragment NewCar on Car {\n    id\n    owner {\n      id\n    }\n  }\n": typeof types.NewCarFragmentDoc,
    "\n  mutation CreateCar($input: CreateCarInput!) {\n    createCar(input: $input) {\n      id\n      ...NewCar\n    }\n  }\n": typeof types.CreateCarDocument,
    "\n  query GetGarage {\n    me {\n      id\n      subscription {\n        id\n        tier\n      }\n      cars {\n        id\n        name\n        make\n        model\n        year\n        bannerImageUrl\n        averageConsumptionLitersPerKm\n        dragSessions {\n          id\n        }\n        upcomingServices {\n          schedule {\n            id\n          }\n        }\n      }\n    }\n  }\n": typeof types.GetGarageDocument,
    "\n  mutation CreateCheckoutSession($input: CreateCheckoutSessionInput!) {\n    createCheckoutSession(input: $input)\n  }\n": typeof types.CreateCheckoutSessionDocument,
    "\n  mutation CreateBillingPortalSession {\n    createBillingPortalSession\n  }\n": typeof types.CreateBillingPortalSessionDocument,
};
const documents: Documents = {
    "\n            query GetMe {\n              me {\n                id\n                email\n              }\n            }\n          ": types.GetMeDocument,
    "\n  fragment PreviewFields on Document {\n    id\n    name\n    url\n    metadata {\n      contentType\n      size\n    }\n  }\n": types.PreviewFieldsFragmentDoc,
    "\n  query GetDocument($id: ID!) {\n    document(id: $id) {\n      id\n      name\n      url\n      tags\n      metadata {\n        contentType\n        size\n      }\n      ...PreviewFields\n    }\n  }\n": types.GetDocumentDocument,
    "\n  query GetMeNavbar {\n    me {\n      id\n      email\n      profile {\n        id\n        username\n        pictureUrl\n      }\n    }\n  }\n": types.GetMeNavbarDocument,
    "\n  query GetCarBanner($id: ID!) {\n    car(id: $id) {\n      id\n      name\n      bannerImageUrl\n    }\n  }\n": types.GetCarBannerDocument,
    "\n  mutation UploadBannerImage($input: CreateMediaInput!) {\n    uploadBannerImage(input: $input) {\n      media {\n        id\n      }\n      uploadUrl\n    }\n  }\n": types.UploadBannerImageDocument,
    "\n  query GetFuelUps($id: ID!) {\n    me {\n      id\n      profile {\n        id\n        fuelConsumptionUnit\n        currencyCode\n        distanceUnit\n        fuelVolumeUnit\n      }\n    }\n    car(id: $id) {\n      id\n      fuelUps {\n        id\n        occurredAt\n        station\n        amountLiters\n        cost\n        fuelCategory\n        octaneRating\n        odometerReading {\n          id\n          readingKm\n        }\n        notes\n        isFullTank\n      }\n      averageConsumptionLitersPerKm\n    }\n  }\n": types.GetFuelUpsDocument,
    "\n  mutation CreateFuelUp($input: CreateFuelUpInput!) {\n    createFuelUp(input: $input) {\n      id\n      occurredAt\n      station\n      amountLiters\n      cost\n      fuelCategory\n      octaneRating\n      odometerReading {\n        id\n        readingKm\n      }\n      notes\n      isFullTank\n    }\n  }\n": types.CreateFuelUpDocument,
    "\n  query GetOdometerReadings($id: ID!) {\n    me {\n      id\n      profile {\n        id\n        distanceUnit\n      }\n    }\n    car(id: $id) {\n      id\n      odometerReadings {\n        id\n        readingKm\n        createTime\n        notes\n      }\n    }\n  }\n": types.GetOdometerReadingsDocument,
    "\n  mutation CreateOdometerReading($input: CreateOdometerReadingInput!) {\n    createOdometerReading(input: $input) {\n      id\n      readingKm\n      createTime\n      notes\n    }\n  }\n": types.CreateOdometerReadingDocument,
    "\n  query GetUpcomingServices($id: ID!) {\n    me {\n      id\n      profile {\n        id\n        distanceUnit\n      }\n    }\n    car(id: $id) {\n      id\n      upcomingServices {\n        nextDueKm\n        nextDueDate\n        schedule {\n          id\n          title\n          notes\n          items {\n            id\n            label\n            notes\n            estimatedMinutes\n            defaultIntervalKm\n            defaultIntervalMonths\n            tags\n          }\n          repeatEveryKm\n          repeatEveryMonths\n          startsAtKm\n          startsAtMonths\n          archived\n        }\n      }\n    }\n  }\n": types.GetUpcomingServicesDocument,
    "\n  query GetServiceItems($id: ID!) {\n    me {\n      id\n      profile {\n        id\n        distanceUnit\n      }\n    }\n    car(id: $id) {\n      id\n      serviceItems {\n        id\n        label\n        notes\n        estimatedMinutes\n        defaultIntervalKm\n        defaultIntervalMonths\n        tags\n      }\n    }\n  }\n": types.GetServiceItemsDocument,
    "\n  mutation CreateServiceItem($input: CreateServiceItemInput!) {\n    createServiceItem(input: $input) {\n      id\n      label\n      notes\n      estimatedMinutes\n      defaultIntervalKm\n      defaultIntervalMonths\n      tags\n    }\n  }\n": types.CreateServiceItemDocument,
    "\n  query GetServiceLogs($id: ID!) {\n    me {\n      id\n      profile {\n        id\n        distanceUnit\n      }\n    }\n    car(id: $id) {\n      id\n      serviceLogs {\n        id\n        datePerformed\n        odometerReading {\n          id\n          readingKm\n          notes\n        }\n        notes\n        items {\n          id\n          label\n          notes\n          estimatedMinutes\n          defaultIntervalKm\n          defaultIntervalMonths\n          tags\n        }\n        schedule {\n          id\n          title\n          notes\n          repeatEveryKm\n          repeatEveryMonths\n          startsAtKm\n          startsAtMonths\n          archived\n        }\n        performedBy\n      }\n    }\n  }\n": types.GetServiceLogsDocument,
    "\n  query GetServiceSchedules($id: ID!) {\n    me {\n      id\n      profile {\n        id\n        distanceUnit\n      }\n    }\n    car(id: $id) {\n      id\n      serviceSchedules {\n        id\n        title\n        notes\n        items {\n          id\n          label\n          notes\n          estimatedMinutes\n          defaultIntervalKm\n          defaultIntervalMonths\n          tags\n        }\n        repeatEveryKm\n        repeatEveryMonths\n        startsAtKm\n        startsAtMonths\n        archived\n      }\n    }\n  }\n": types.GetServiceSchedulesDocument,
    "\n  mutation CreateServiceLog($input: CreateServiceLogInput!) {\n    createServiceLog(input: $input) {\n      id\n      datePerformed\n      odometerReading {\n        id\n        readingKm\n        notes\n      }\n      notes\n      items {\n        id\n        label\n        notes\n        estimatedMinutes\n        defaultIntervalKm\n        defaultIntervalMonths\n        tags\n      }\n      schedule {\n        id\n        title\n        notes\n        repeatEveryKm\n        repeatEveryMonths\n        startsAtKm\n        startsAtMonths\n        archived\n      }\n      performedBy\n    }\n  }\n": types.CreateServiceLogDocument,
    "\n  mutation CreateServiceSchedule($input: CreateServiceScheduleInput!) {\n    createServiceSchedule(input: $input) {\n      id\n      title\n      notes\n      items {\n        id\n        label\n        notes\n        estimatedMinutes\n        defaultIntervalKm\n        defaultIntervalMonths\n        tags\n      }\n      repeatEveryKm\n      repeatEveryMonths\n      startsAtKm\n      startsAtMonths\n      archived\n    }\n  }\n": types.CreateServiceScheduleDocument,
    "\n  mutation CreateDragSession($input: CreateDragSessionInput!) {\n    createDragSession(input: $input) {\n      id\n      title\n      notes\n    }\n  }\n": types.CreateDragSessionDocument,
    "\n  query GetDragSessions($id: ID!) {\n    car(id: $id) {\n      id\n      dragSessions {\n        id\n        title\n        notes\n        results {\n          id\n        }\n      }\n    }\n  }\n": types.GetDragSessionsDocument,
    "\n  query GetDragSession($id: ID!) {\n    dragSession(id: $id) {\n      id\n      title\n      notes\n      results {\n        id\n        unit\n        value\n        result\n      }\n    }\n  }\n": types.GetDragSessionDocument,
    "\n  mutation CreateDragResult($input: CreateDragResultInput!) {\n    createDragResult(input: $input) {\n      id\n      unit\n      value\n      result\n    }\n  }\n": types.CreateDragResultDocument,
    "\n  mutation CreateDynoSession($input: CreateDynoSessionInput!) {\n    createDynoSession(input: $input) {\n      id\n      title\n      notes\n    }\n  }\n": types.CreateDynoSessionDocument,
    "\n  query GetDynoSessions($id: ID!) {\n    car(id: $id) {\n      id\n      dynoSessions {\n        id\n        title\n        notes\n        results {\n          id\n        }\n      }\n    }\n  }\n": types.GetDynoSessionsDocument,
    "\n  query GetDynoSession($id: ID!) {\n    dynoSession(id: $id) {\n      id\n      title\n      notes\n      results {\n        id\n        rpm\n        powerKw\n        torqueNm\n      }\n    }\n  }\n": types.GetDynoSessionDocument,
    "\n  mutation CreateDynoResult($input: CreateDynoResultInput!) {\n    createDynoResult(input: $input) {\n      id\n      rpm\n      powerKw\n      torqueNm\n    }\n  }\n": types.CreateDynoResultDocument,
    "\n  query GetProfile {\n    me {\n      id\n      profile {\n        id\n        username\n        firstName\n        lastName\n        currencyCode\n        fuelVolumeUnit\n        distanceUnit\n        fuelConsumptionUnit\n        temperatureUnit\n        pictureUrl\n      }\n    }\n  }\n": types.GetProfileDocument,
    "\n  mutation UpdateProfile($input: UpdateProfileInput!) {\n    updateProfile(input: $input) {\n      id\n      username\n      firstName\n      lastName\n      currencyCode\n      fuelVolumeUnit\n      distanceUnit\n      fuelConsumptionUnit\n      temperatureUnit\n    }\n  }\n": types.UpdateProfileDocument,
    "\n  mutation UploadProfilePicture($input: UploadProfilePictureInput!) {\n    uploadProfilePicture(input: $input) {\n      id\n      pictureUrl\n    }\n  }\n": types.UploadProfilePictureDocument,
    "\n  query GetSubscription {\n    me {\n      id\n      subscription {\n        id\n        tier\n      }\n    }\n  }\n": types.GetSubscriptionDocument,
    "\n  query GetDocuments($id: ID!) {\n    car(id: $id) {\n      id\n      documents {\n        id\n        name\n        tags\n        url\n        metadata {\n          contentType\n          size\n        }\n      }\n    }\n  }\n": types.GetDocumentsDocument,
    "\n  mutation UploadDocument($input: CreateDocumentInput!) {\n    uploadDocument(input: $input) {\n      document {\n        id\n        name\n        tags\n        url\n      }\n      uploadUrl\n    }\n  }\n": types.UploadDocumentDocument,
    "\n  query GetGallery($id: ID!) {\n    car(id: $id) {\n      id\n      media {\n        id\n        url\n      }\n    }\n  }\n": types.GetGalleryDocument,
    "\n  mutation UploadMedia($input: CreateMediaInput!) {\n    uploadMedia(input: $input) {\n      media {\n        id\n        url\n      }\n      uploadUrl\n    }\n  }\n": types.UploadMediaDocument,
    "\n  fragment NewCar on Car {\n    id\n    owner {\n      id\n    }\n  }\n": types.NewCarFragmentDoc,
    "\n  mutation CreateCar($input: CreateCarInput!) {\n    createCar(input: $input) {\n      id\n      ...NewCar\n    }\n  }\n": types.CreateCarDocument,
    "\n  query GetGarage {\n    me {\n      id\n      subscription {\n        id\n        tier\n      }\n      cars {\n        id\n        name\n        make\n        model\n        year\n        bannerImageUrl\n        averageConsumptionLitersPerKm\n        dragSessions {\n          id\n        }\n        upcomingServices {\n          schedule {\n            id\n          }\n        }\n      }\n    }\n  }\n": types.GetGarageDocument,
    "\n  mutation CreateCheckoutSession($input: CreateCheckoutSessionInput!) {\n    createCheckoutSession(input: $input)\n  }\n": types.CreateCheckoutSessionDocument,
    "\n  mutation CreateBillingPortalSession {\n    createBillingPortalSession\n  }\n": types.CreateBillingPortalSessionDocument,
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
export function graphql(source: "\n  fragment PreviewFields on Document {\n    id\n    name\n    url\n    metadata {\n      contentType\n      size\n    }\n  }\n"): (typeof documents)["\n  fragment PreviewFields on Document {\n    id\n    name\n    url\n    metadata {\n      contentType\n      size\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetDocument($id: ID!) {\n    document(id: $id) {\n      id\n      name\n      url\n      tags\n      metadata {\n        contentType\n        size\n      }\n      ...PreviewFields\n    }\n  }\n"): (typeof documents)["\n  query GetDocument($id: ID!) {\n    document(id: $id) {\n      id\n      name\n      url\n      tags\n      metadata {\n        contentType\n        size\n      }\n      ...PreviewFields\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetMeNavbar {\n    me {\n      id\n      email\n      profile {\n        id\n        username\n        pictureUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetMeNavbar {\n    me {\n      id\n      email\n      profile {\n        id\n        username\n        pictureUrl\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCarBanner($id: ID!) {\n    car(id: $id) {\n      id\n      name\n      bannerImageUrl\n    }\n  }\n"): (typeof documents)["\n  query GetCarBanner($id: ID!) {\n    car(id: $id) {\n      id\n      name\n      bannerImageUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UploadBannerImage($input: CreateMediaInput!) {\n    uploadBannerImage(input: $input) {\n      media {\n        id\n      }\n      uploadUrl\n    }\n  }\n"): (typeof documents)["\n  mutation UploadBannerImage($input: CreateMediaInput!) {\n    uploadBannerImage(input: $input) {\n      media {\n        id\n      }\n      uploadUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetFuelUps($id: ID!) {\n    me {\n      id\n      profile {\n        id\n        fuelConsumptionUnit\n        currencyCode\n        distanceUnit\n        fuelVolumeUnit\n      }\n    }\n    car(id: $id) {\n      id\n      fuelUps {\n        id\n        occurredAt\n        station\n        amountLiters\n        cost\n        fuelCategory\n        octaneRating\n        odometerReading {\n          id\n          readingKm\n        }\n        notes\n        isFullTank\n      }\n      averageConsumptionLitersPerKm\n    }\n  }\n"): (typeof documents)["\n  query GetFuelUps($id: ID!) {\n    me {\n      id\n      profile {\n        id\n        fuelConsumptionUnit\n        currencyCode\n        distanceUnit\n        fuelVolumeUnit\n      }\n    }\n    car(id: $id) {\n      id\n      fuelUps {\n        id\n        occurredAt\n        station\n        amountLiters\n        cost\n        fuelCategory\n        octaneRating\n        odometerReading {\n          id\n          readingKm\n        }\n        notes\n        isFullTank\n      }\n      averageConsumptionLitersPerKm\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateFuelUp($input: CreateFuelUpInput!) {\n    createFuelUp(input: $input) {\n      id\n      occurredAt\n      station\n      amountLiters\n      cost\n      fuelCategory\n      octaneRating\n      odometerReading {\n        id\n        readingKm\n      }\n      notes\n      isFullTank\n    }\n  }\n"): (typeof documents)["\n  mutation CreateFuelUp($input: CreateFuelUpInput!) {\n    createFuelUp(input: $input) {\n      id\n      occurredAt\n      station\n      amountLiters\n      cost\n      fuelCategory\n      octaneRating\n      odometerReading {\n        id\n        readingKm\n      }\n      notes\n      isFullTank\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetOdometerReadings($id: ID!) {\n    me {\n      id\n      profile {\n        id\n        distanceUnit\n      }\n    }\n    car(id: $id) {\n      id\n      odometerReadings {\n        id\n        readingKm\n        createTime\n        notes\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetOdometerReadings($id: ID!) {\n    me {\n      id\n      profile {\n        id\n        distanceUnit\n      }\n    }\n    car(id: $id) {\n      id\n      odometerReadings {\n        id\n        readingKm\n        createTime\n        notes\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateOdometerReading($input: CreateOdometerReadingInput!) {\n    createOdometerReading(input: $input) {\n      id\n      readingKm\n      createTime\n      notes\n    }\n  }\n"): (typeof documents)["\n  mutation CreateOdometerReading($input: CreateOdometerReadingInput!) {\n    createOdometerReading(input: $input) {\n      id\n      readingKm\n      createTime\n      notes\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetUpcomingServices($id: ID!) {\n    me {\n      id\n      profile {\n        id\n        distanceUnit\n      }\n    }\n    car(id: $id) {\n      id\n      upcomingServices {\n        nextDueKm\n        nextDueDate\n        schedule {\n          id\n          title\n          notes\n          items {\n            id\n            label\n            notes\n            estimatedMinutes\n            defaultIntervalKm\n            defaultIntervalMonths\n            tags\n          }\n          repeatEveryKm\n          repeatEveryMonths\n          startsAtKm\n          startsAtMonths\n          archived\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUpcomingServices($id: ID!) {\n    me {\n      id\n      profile {\n        id\n        distanceUnit\n      }\n    }\n    car(id: $id) {\n      id\n      upcomingServices {\n        nextDueKm\n        nextDueDate\n        schedule {\n          id\n          title\n          notes\n          items {\n            id\n            label\n            notes\n            estimatedMinutes\n            defaultIntervalKm\n            defaultIntervalMonths\n            tags\n          }\n          repeatEveryKm\n          repeatEveryMonths\n          startsAtKm\n          startsAtMonths\n          archived\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetServiceItems($id: ID!) {\n    me {\n      id\n      profile {\n        id\n        distanceUnit\n      }\n    }\n    car(id: $id) {\n      id\n      serviceItems {\n        id\n        label\n        notes\n        estimatedMinutes\n        defaultIntervalKm\n        defaultIntervalMonths\n        tags\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetServiceItems($id: ID!) {\n    me {\n      id\n      profile {\n        id\n        distanceUnit\n      }\n    }\n    car(id: $id) {\n      id\n      serviceItems {\n        id\n        label\n        notes\n        estimatedMinutes\n        defaultIntervalKm\n        defaultIntervalMonths\n        tags\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateServiceItem($input: CreateServiceItemInput!) {\n    createServiceItem(input: $input) {\n      id\n      label\n      notes\n      estimatedMinutes\n      defaultIntervalKm\n      defaultIntervalMonths\n      tags\n    }\n  }\n"): (typeof documents)["\n  mutation CreateServiceItem($input: CreateServiceItemInput!) {\n    createServiceItem(input: $input) {\n      id\n      label\n      notes\n      estimatedMinutes\n      defaultIntervalKm\n      defaultIntervalMonths\n      tags\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetServiceLogs($id: ID!) {\n    me {\n      id\n      profile {\n        id\n        distanceUnit\n      }\n    }\n    car(id: $id) {\n      id\n      serviceLogs {\n        id\n        datePerformed\n        odometerReading {\n          id\n          readingKm\n          notes\n        }\n        notes\n        items {\n          id\n          label\n          notes\n          estimatedMinutes\n          defaultIntervalKm\n          defaultIntervalMonths\n          tags\n        }\n        schedule {\n          id\n          title\n          notes\n          repeatEveryKm\n          repeatEveryMonths\n          startsAtKm\n          startsAtMonths\n          archived\n        }\n        performedBy\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetServiceLogs($id: ID!) {\n    me {\n      id\n      profile {\n        id\n        distanceUnit\n      }\n    }\n    car(id: $id) {\n      id\n      serviceLogs {\n        id\n        datePerformed\n        odometerReading {\n          id\n          readingKm\n          notes\n        }\n        notes\n        items {\n          id\n          label\n          notes\n          estimatedMinutes\n          defaultIntervalKm\n          defaultIntervalMonths\n          tags\n        }\n        schedule {\n          id\n          title\n          notes\n          repeatEveryKm\n          repeatEveryMonths\n          startsAtKm\n          startsAtMonths\n          archived\n        }\n        performedBy\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetServiceSchedules($id: ID!) {\n    me {\n      id\n      profile {\n        id\n        distanceUnit\n      }\n    }\n    car(id: $id) {\n      id\n      serviceSchedules {\n        id\n        title\n        notes\n        items {\n          id\n          label\n          notes\n          estimatedMinutes\n          defaultIntervalKm\n          defaultIntervalMonths\n          tags\n        }\n        repeatEveryKm\n        repeatEveryMonths\n        startsAtKm\n        startsAtMonths\n        archived\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetServiceSchedules($id: ID!) {\n    me {\n      id\n      profile {\n        id\n        distanceUnit\n      }\n    }\n    car(id: $id) {\n      id\n      serviceSchedules {\n        id\n        title\n        notes\n        items {\n          id\n          label\n          notes\n          estimatedMinutes\n          defaultIntervalKm\n          defaultIntervalMonths\n          tags\n        }\n        repeatEveryKm\n        repeatEveryMonths\n        startsAtKm\n        startsAtMonths\n        archived\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateServiceLog($input: CreateServiceLogInput!) {\n    createServiceLog(input: $input) {\n      id\n      datePerformed\n      odometerReading {\n        id\n        readingKm\n        notes\n      }\n      notes\n      items {\n        id\n        label\n        notes\n        estimatedMinutes\n        defaultIntervalKm\n        defaultIntervalMonths\n        tags\n      }\n      schedule {\n        id\n        title\n        notes\n        repeatEveryKm\n        repeatEveryMonths\n        startsAtKm\n        startsAtMonths\n        archived\n      }\n      performedBy\n    }\n  }\n"): (typeof documents)["\n  mutation CreateServiceLog($input: CreateServiceLogInput!) {\n    createServiceLog(input: $input) {\n      id\n      datePerformed\n      odometerReading {\n        id\n        readingKm\n        notes\n      }\n      notes\n      items {\n        id\n        label\n        notes\n        estimatedMinutes\n        defaultIntervalKm\n        defaultIntervalMonths\n        tags\n      }\n      schedule {\n        id\n        title\n        notes\n        repeatEveryKm\n        repeatEveryMonths\n        startsAtKm\n        startsAtMonths\n        archived\n      }\n      performedBy\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateServiceSchedule($input: CreateServiceScheduleInput!) {\n    createServiceSchedule(input: $input) {\n      id\n      title\n      notes\n      items {\n        id\n        label\n        notes\n        estimatedMinutes\n        defaultIntervalKm\n        defaultIntervalMonths\n        tags\n      }\n      repeatEveryKm\n      repeatEveryMonths\n      startsAtKm\n      startsAtMonths\n      archived\n    }\n  }\n"): (typeof documents)["\n  mutation CreateServiceSchedule($input: CreateServiceScheduleInput!) {\n    createServiceSchedule(input: $input) {\n      id\n      title\n      notes\n      items {\n        id\n        label\n        notes\n        estimatedMinutes\n        defaultIntervalKm\n        defaultIntervalMonths\n        tags\n      }\n      repeatEveryKm\n      repeatEveryMonths\n      startsAtKm\n      startsAtMonths\n      archived\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateDragSession($input: CreateDragSessionInput!) {\n    createDragSession(input: $input) {\n      id\n      title\n      notes\n    }\n  }\n"): (typeof documents)["\n  mutation CreateDragSession($input: CreateDragSessionInput!) {\n    createDragSession(input: $input) {\n      id\n      title\n      notes\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetDragSessions($id: ID!) {\n    car(id: $id) {\n      id\n      dragSessions {\n        id\n        title\n        notes\n        results {\n          id\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetDragSessions($id: ID!) {\n    car(id: $id) {\n      id\n      dragSessions {\n        id\n        title\n        notes\n        results {\n          id\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetDragSession($id: ID!) {\n    dragSession(id: $id) {\n      id\n      title\n      notes\n      results {\n        id\n        unit\n        value\n        result\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetDragSession($id: ID!) {\n    dragSession(id: $id) {\n      id\n      title\n      notes\n      results {\n        id\n        unit\n        value\n        result\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateDragResult($input: CreateDragResultInput!) {\n    createDragResult(input: $input) {\n      id\n      unit\n      value\n      result\n    }\n  }\n"): (typeof documents)["\n  mutation CreateDragResult($input: CreateDragResultInput!) {\n    createDragResult(input: $input) {\n      id\n      unit\n      value\n      result\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateDynoSession($input: CreateDynoSessionInput!) {\n    createDynoSession(input: $input) {\n      id\n      title\n      notes\n    }\n  }\n"): (typeof documents)["\n  mutation CreateDynoSession($input: CreateDynoSessionInput!) {\n    createDynoSession(input: $input) {\n      id\n      title\n      notes\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetDynoSessions($id: ID!) {\n    car(id: $id) {\n      id\n      dynoSessions {\n        id\n        title\n        notes\n        results {\n          id\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetDynoSessions($id: ID!) {\n    car(id: $id) {\n      id\n      dynoSessions {\n        id\n        title\n        notes\n        results {\n          id\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetDynoSession($id: ID!) {\n    dynoSession(id: $id) {\n      id\n      title\n      notes\n      results {\n        id\n        rpm\n        powerKw\n        torqueNm\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetDynoSession($id: ID!) {\n    dynoSession(id: $id) {\n      id\n      title\n      notes\n      results {\n        id\n        rpm\n        powerKw\n        torqueNm\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateDynoResult($input: CreateDynoResultInput!) {\n    createDynoResult(input: $input) {\n      id\n      rpm\n      powerKw\n      torqueNm\n    }\n  }\n"): (typeof documents)["\n  mutation CreateDynoResult($input: CreateDynoResultInput!) {\n    createDynoResult(input: $input) {\n      id\n      rpm\n      powerKw\n      torqueNm\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetProfile {\n    me {\n      id\n      profile {\n        id\n        username\n        firstName\n        lastName\n        currencyCode\n        fuelVolumeUnit\n        distanceUnit\n        fuelConsumptionUnit\n        temperatureUnit\n        pictureUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetProfile {\n    me {\n      id\n      profile {\n        id\n        username\n        firstName\n        lastName\n        currencyCode\n        fuelVolumeUnit\n        distanceUnit\n        fuelConsumptionUnit\n        temperatureUnit\n        pictureUrl\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UpdateProfile($input: UpdateProfileInput!) {\n    updateProfile(input: $input) {\n      id\n      username\n      firstName\n      lastName\n      currencyCode\n      fuelVolumeUnit\n      distanceUnit\n      fuelConsumptionUnit\n      temperatureUnit\n    }\n  }\n"): (typeof documents)["\n  mutation UpdateProfile($input: UpdateProfileInput!) {\n    updateProfile(input: $input) {\n      id\n      username\n      firstName\n      lastName\n      currencyCode\n      fuelVolumeUnit\n      distanceUnit\n      fuelConsumptionUnit\n      temperatureUnit\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UploadProfilePicture($input: UploadProfilePictureInput!) {\n    uploadProfilePicture(input: $input) {\n      id\n      pictureUrl\n    }\n  }\n"): (typeof documents)["\n  mutation UploadProfilePicture($input: UploadProfilePictureInput!) {\n    uploadProfilePicture(input: $input) {\n      id\n      pictureUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetSubscription {\n    me {\n      id\n      subscription {\n        id\n        tier\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetSubscription {\n    me {\n      id\n      subscription {\n        id\n        tier\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetDocuments($id: ID!) {\n    car(id: $id) {\n      id\n      documents {\n        id\n        name\n        tags\n        url\n        metadata {\n          contentType\n          size\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetDocuments($id: ID!) {\n    car(id: $id) {\n      id\n      documents {\n        id\n        name\n        tags\n        url\n        metadata {\n          contentType\n          size\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UploadDocument($input: CreateDocumentInput!) {\n    uploadDocument(input: $input) {\n      document {\n        id\n        name\n        tags\n        url\n      }\n      uploadUrl\n    }\n  }\n"): (typeof documents)["\n  mutation UploadDocument($input: CreateDocumentInput!) {\n    uploadDocument(input: $input) {\n      document {\n        id\n        name\n        tags\n        url\n      }\n      uploadUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetGallery($id: ID!) {\n    car(id: $id) {\n      id\n      media {\n        id\n        url\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetGallery($id: ID!) {\n    car(id: $id) {\n      id\n      media {\n        id\n        url\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation UploadMedia($input: CreateMediaInput!) {\n    uploadMedia(input: $input) {\n      media {\n        id\n        url\n      }\n      uploadUrl\n    }\n  }\n"): (typeof documents)["\n  mutation UploadMedia($input: CreateMediaInput!) {\n    uploadMedia(input: $input) {\n      media {\n        id\n        url\n      }\n      uploadUrl\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment NewCar on Car {\n    id\n    owner {\n      id\n    }\n  }\n"): (typeof documents)["\n  fragment NewCar on Car {\n    id\n    owner {\n      id\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCar($input: CreateCarInput!) {\n    createCar(input: $input) {\n      id\n      ...NewCar\n    }\n  }\n"): (typeof documents)["\n  mutation CreateCar($input: CreateCarInput!) {\n    createCar(input: $input) {\n      id\n      ...NewCar\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetGarage {\n    me {\n      id\n      subscription {\n        id\n        tier\n      }\n      cars {\n        id\n        name\n        make\n        model\n        year\n        bannerImageUrl\n        averageConsumptionLitersPerKm\n        dragSessions {\n          id\n        }\n        upcomingServices {\n          schedule {\n            id\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetGarage {\n    me {\n      id\n      subscription {\n        id\n        tier\n      }\n      cars {\n        id\n        name\n        make\n        model\n        year\n        bannerImageUrl\n        averageConsumptionLitersPerKm\n        dragSessions {\n          id\n        }\n        upcomingServices {\n          schedule {\n            id\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateCheckoutSession($input: CreateCheckoutSessionInput!) {\n    createCheckoutSession(input: $input)\n  }\n"): (typeof documents)["\n  mutation CreateCheckoutSession($input: CreateCheckoutSessionInput!) {\n    createCheckoutSession(input: $input)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateBillingPortalSession {\n    createBillingPortalSession\n  }\n"): (typeof documents)["\n  mutation CreateBillingPortalSession {\n    createBillingPortalSession\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;