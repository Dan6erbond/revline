import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Link,
} from "@heroui/react";
import { FileText, Gauge, Plus } from "lucide-react";

import Create from "./create";
import Session from "./session";
import { Suspense } from "react";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { isUUID } from "@/utils/is-uuid";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const getDynoSessions = graphql(`
  query GetDynoSessions($id: ID!) {
    car(id: $id) {
      id
      dynoSessions {
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

export default function DynoSessions() {
  const router = useRouter();

  const { data } = useQuery(getDynoSessions, {
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
        <h2 className="text-2xl">Dyno sessions</h2>
        <Button
          startContent={<Plus />}
          as={Link}
          href={`/cars/${router.query.id}/performance/dyno-sessions/create`}
        >
          Add
        </Button>
      </div>
      {data?.car.dynoSessions?.map((session) => (
        <Card
          key={session.id}
          as={Link}
          isPressable
          href={`/cars/${router.query.id}/performance/dyno-sessions/${session.id}`}
          className="hover:shadow-lg transition-shadow duration-200 group bg-primary-50/10 backdrop-blur-md rounded-xl p-4"
        >
          <CardHeader className="text-lg font-semibold flex items-center justify-between">
            <span>{session.title}</span>
            <Gauge className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-200" />
          </CardHeader>

          {session.notes && (
            <CardBody className="text-sm text-muted-foreground flex items-start gap-2">
              <FileText className="w-4 h-4 mt-0.5 text-muted" />
              <span className="line-clamp-2">{session.notes}</span>
            </CardBody>
          )}

          <CardFooter className="text-xs text-muted-foreground flex justify-between items-center pt-2">
            <span>
              {session.results?.length ?? 0} result
              {session.results?.length === 1 ? "" : "s"}
            </span>
            <span className="text-xs text-muted tracking-tight">
              ↗ View session
            </span>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
