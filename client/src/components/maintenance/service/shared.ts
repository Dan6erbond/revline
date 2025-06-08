import { graphql } from "@/gql";

export const getServiceLogs = graphql(`
  query GetServiceLogs($id: ID!) {
    me {
      id
      settings {
        id
        distanceUnit
      }
    }
    car(id: $id) {
      id
      serviceLogs {
        id
        datePerformed
        odometerReading {
          id
          readingKm
          notes
        }
        notes
        items {
          id
          label
          notes
          estimatedMinutes
          defaultIntervalKm
          defaultIntervalMonths
          tags
        }
        schedule {
          id
          title
          notes
          repeatEveryKm
          repeatEveryMonths
          startsAtKm
          startsAtMonths
          archived
        }
        performedBy
        documents {
          id
          name
          tags
          metadata {
            contentType
          }
        }
        tags
      }
    }
  }
`);

export const getServiceItems = graphql(`
  query GetServiceItems($id: ID!) {
    me {
      id
      settings {
        id
        distanceUnit
      }
    }
    car(id: $id) {
      id
      serviceItems {
        id
        label
        notes
        estimatedMinutes
        defaultIntervalKm
        defaultIntervalMonths
        tags
      }
    }
  }
`);

export const getServiceSchedules = graphql(`
  query GetServiceSchedules($id: ID!) {
    me {
      id
      settings {
        id
        distanceUnit
      }
    }
    car(id: $id) {
      id
      serviceSchedules {
        id
        title
        notes
        items {
          id
          label
          notes
          estimatedMinutes
          defaultIntervalKm
          defaultIntervalMonths
          tags
        }
        repeatEveryKm
        repeatEveryMonths
        startsAtKm
        startsAtMonths
        archived
      }
    }
  }
`);
