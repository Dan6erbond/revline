import { graphql } from "@/gql";

export const getAlbum = graphql(`
  query GetAlbum($id: ID!) {
    album(id: $id) {
      id
      title
      media {
        id
        ...MediaItem
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
