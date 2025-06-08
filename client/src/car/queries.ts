import { graphql } from "@/gql";

export const getCarWithOwner = graphql(`
  query GetCarWithOwner($id: ID!) {
    me {
      id
      settings {
        id
        powerUnit
        torqueUnit
      }
    }
    car(id: $id) {
      id
      name
      make
      model
      trim
      year
      bannerImage {
        id
        url
      }
      owner {
        id
        email
        profile {
          id
          username
        }
      }
    }
  }
`);
