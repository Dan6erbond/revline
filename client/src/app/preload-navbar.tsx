import Navbar from "./navbar";
import { PreloadQuery } from "@/apollo-client/server";
import { graphql } from "@/gql";

const getMe = graphql(`
  query GetMeNavbar {
    me {
      id
      email
      profile {
        id
        username
        pictureUrl
      }
    }
  }
`);

export default async function AppNavbar() {
  return (
    <PreloadQuery query={getMe}>
      <Navbar />
    </PreloadQuery>
  );
}
