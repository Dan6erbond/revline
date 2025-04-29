import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from "@heroui/react";

import Create from "./create";
import { Plus } from "lucide-react";
import Session from "./session";
import { Suspense } from "react";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { isUUID } from "@/utils/is-uuid";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const getDragSessions = graphql(`
  query GetDragSessions($id: ID!) {
    car(id: $id) {
      id
      dragSessions {
        id
        title
        notes
        results {
          id
        }
      }
    }
  }
`);

export default function DragSessions() {
  const router = useRouter();

  const { data } = useQuery(getDragSessions, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  if (router.query.tab?.[1] === "create") {
    return <Create />;
  } else if (isUUID(router.query.tab?.[1])) {
    return (
      <Suspense fallback="Loading...">
        <Session />
      </Suspense>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-w-screen-xl mx-auto">
      <div className="flex justify-between">
        <h2 className="text-2xl">Drag sessions</h2>
        <Button
          startContent={<Plus />}
          as={Link}
          href={`/cars/${router.query.id}/performance/drag-sessions/create`}
        >
          Add
        </Button>
      </div>
      {data?.car.dragSessions?.map((session) => (
        <Card
          key={session.id}
          as={Link}
          isPressable
          href={`/cars/${router.query.id}/performance/drag-sessions/${session.id}`}
        >
          <CardHeader>{session.title}</CardHeader>
          <CardBody>{session.notes}</CardBody>
          <CardFooter>{session.results?.length} results</CardFooter>
        </Card>
      ))}
    </div>
  );
}
