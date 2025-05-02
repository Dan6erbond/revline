import { graphql } from "@/gql";

export const getMedia = graphql(`
  query GetMedia($id: ID!) {
    media(id: $id) {
      id
      url
      metadata {
        contentType
        size
      }
      car {
        id
        name
        owner {
          id
          email
          profile {
            id
            username
            pictureUrl
          }
        }
      }
    }
  }
`);
