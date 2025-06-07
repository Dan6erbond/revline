import CarLayout from "@/components/layout/car-layout";
import Expenses from "@/components/expenses";
import PublicCarLayout from "@/components/layout/public-car-layout";
import PublicOverview from "@/components/car/public-overview";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const getCarWithOwner = graphql(`
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
      owner {
        id
      }
    }
  }
`);

export default function Car() {
  const router = useRouter();
  const { data: session } = useSession();

  const { data } = useQuery(getCarWithOwner, {
    variables: {
      id: getQueryParam(router.query.id) as string,
    },
    skip: !router.query.id,
  });

  if (!session || !data || data.car.owner?.id !== session.user?.id) {
    return (
      <PublicCarLayout>
        <PublicOverview />
      </PublicCarLayout>
    );
  }

  return (
    <CarLayout>
      <Expenses />
    </CarLayout>
  );
}
