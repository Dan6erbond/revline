import { graphql } from "@/gql";

export const getMedia = graphql(`
  query GetMedia($id: ID!) {
    media(id: $id) {
      id
      title
      description
      url
      ...MediaItem
      metadata {
        contentType
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
