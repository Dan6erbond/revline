import { ActivitySquare, FileText, Gauge, Settings, Timer } from "lucide-react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { DragResultUnit, PowerUnit, TorqueUnit } from "@/gql/graphql";
import { useEffect, useState } from "react";

import DynoSessionChart from "../performance/dyno-sessions/chart";
import Link from "next/link";
import { createExtensions } from "../minimal-tiptap/hooks/use-minimal-tiptap";
import { generateHTML } from "@tiptap/react";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { resolveDragResultType } from "@/utils/drag-session";
import { signIn } from "next-auth/react";
import { useConfig } from "../../contexts/config";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useUnits } from "../../hooks/use-units";

const getPublicCarOverview = graphql(`
  query GetPublicCarOverview($id: ID!) {
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
      dragSessions {
        id
        title
        notes
        results {
          id
          unit
          value
          result
        }
      }
      dynoSessions {
        id
        title
        notes
        results {
          id
          rpm
          powerKw
          torqueNm
        }
      }
    }
  }
`);

function DragSessionCard({
  session,
}: {
  session: {
    __typename?: "DragSession";
    id: string;
    title: string;
    notes?: any | null;
    results?: Array<{
      __typename?: "DragResult";
      id: string;
      unit: DragResultUnit;
      value: number;
      result: number;
    }> | null;
  };
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Card
        key={session.id}
        isPressable
        onPress={onOpen}
        className="transition-shadow duration-200 group bg-primary-50/5 backdrop-blur-md rounded-xl p-4"
      >
        <CardHeader className="text-lg font-semibold flex items-center justify-between">
          <span>{session.title}</span>
          <Timer className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-200" />
        </CardHeader>

        {session.notes && (
          <CardBody className="text-sm text-muted-foreground flex items-start gap-2">
            <FileText className="w-4 h-4 mt-0.5 text-muted" />
            <span
              className="line-clamp-2"
              dangerouslySetInnerHTML={{
                __html: generateHTML(session.notes, createExtensions("")),
              }}
            />
          </CardBody>
        )}

        <CardFooter className="text-xs text-muted-foreground flex justify-between items-center pt-2">
          <span>
            {session.results?.length ?? 0} result
            {session.results?.length === 1 ? "" : "s"}
          </span>
          <span className="text-xs text-muted tracking-tight">
            ↗ View results
          </span>
        </CardFooter>
      </Card>

      <Modal isOpen={isOpen} size="2xl" onClose={onClose}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader>{session.title}</ModalHeader>
              <ModalBody>
                {session.results
                  ?.toSorted((a, b) => a.result - b.result)
                  .map((r, index) => {
                    const label =
                      resolveDragResultType(r.unit, r.value) ??
                      `0-${r.value} ${r.unit}`;

                    return (
                      <Card
                        key={r.id}
                        className="bg-primary-50/5 border border-primary-100 rounded-xl shadow hover:shadow-md transition-all duration-200 mb-4"
                      >
                        <CardHeader className="pb-0">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Gauge className="w-4 h-4 text-primary-500" />
                              <span>{label}</span>
                            </div>
                            <span className="text-xs">#{index + 1}</span>
                          </div>
                        </CardHeader>

                        <CardBody className="flex items-center justify-center py-6">
                          <div className="text-3xl font-semibold text-primary-700 flex items-center gap-2">
                            <Timer className="w-5 h-5" />
                            {r.result.toFixed(2)}s
                          </div>
                        </CardBody>

                        <CardFooter className="text-xs text-muted-foreground text-right pt-0">
                          Run ID: {r.id.slice(0, 8)}
                        </CardFooter>
                      </Card>
                    );
                  })}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

function DynoSessionCard({
  session,
  ...props
}: {
  session: {
    __typename?: "DynoSession";
    id: string;
    title: string;
    notes?: any | null;
    results?: Array<{
      __typename?: "DynoResult";
      id: string;
      rpm: number;
      powerKw?: number | null;
      torqueNm?: number | null;
    }> | null;
  };
  powerUnit: PowerUnit;
  torqueUnit: TorqueUnit;
}) {
  return (
    <Card
      key={session.id}
      className="transition-shadow duration-200 group bg-primary-50/5 backdrop-blur-md rounded-xl p-4"
    >
      <CardHeader className="text-lg font-semibold flex items-center justify-between">
        <span>{session.title}</span>
        <ActivitySquare className="w-5 h-5 text-primary group-hover:scale-110 transition-transform duration-200" />
      </CardHeader>

      {session.notes && (
        <CardBody className="text-sm text-muted-foreground flex items-start gap-2">
          <FileText className="w-4 h-4 mt-0.5 text-muted" />
          <span
            className="line-clamp-2"
            dangerouslySetInnerHTML={{
              __html: generateHTML(session.notes, createExtensions("")),
            }}
          />
          <DynoSessionChart
            session={session}
            className="self-center my-4"
            {...props}
          />
        </CardBody>
      )}

      <CardFooter className="text-xs text-muted-foreground flex justify-between items-center pt-2">
        <span>
          {session.results?.length ?? 0} entr
          {session.results?.length === 1 ? "y" : "ies"}
        </span>
      </CardFooter>
    </Card>
  );
}

export default function PublicOverview() {
  const router = useRouter();
  const { basePath } = useConfig();

  const [providers, setProviders] = useState<{
    [key: string]: { id: string };
  }>({});

  useEffect(() => {
    fetch(basePath + "/api/auth/providers")
      .then((res) => res.json())
      .then((providers) => setProviders(providers));
  }, [setProviders]);

  const { data } = useQuery(getPublicCarOverview, {
    variables: {
      id: getQueryParam(router.query.id) as string,
    },
    skip: !router.query.id,
  });

  const { powerUnit, torqueUnit } = useUnits(data?.me?.settings);

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      {/* Alert for unauthenticated users */}
      {data?.me == null && (
        <Alert
          color="secondary"
          variant="faded"
          title="You're not logged in"
          description="Create an account or log in to manage your cars, get personalized tuning info, and access all Revline features."
          endContent={
            <div className="flex gap-2">
              <Button
                onPress={() =>
                  signIn(
                    Object.values(providers).length === 1 &&
                      Object.values(providers)[0].id !== "credentials"
                      ? Object.values(providers)[0].id
                      : undefined,
                    {
                      redirectTo: router.asPath,
                    }
                  )
                }
                color="primary"
                size="sm"
                variant="bordered"
              >
                Sign in
              </Button>
            </div>
          }
        />
      )}

      {/* Alert for users without unit settings */}
      {data?.me && data?.me?.settings == null && (
        <Alert
          color="warning"
          variant="faded"
          title="Unit settings incomplete"
          description="To get accurate results, please set your preferred units for torque, power, and other measurements."
          endContent={
            <Button
              as={Link}
              href="/settings"
              color="warning"
              size="sm"
              variant="flat"
              startContent={<Settings className="size-4" />}
            >
              Configure now
            </Button>
          }
        />
      )}

      <section>
        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
          <Timer className="w-5 h-5 text-primary-500" /> Drag Sessions
          <span className="text-muted-foreground text-sm font-normal">
            ({data?.car.dragSessions?.length ?? 0} total)
          </span>
        </h2>

        {data?.car.dragSessions?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.car.dragSessions.map((session) => (
              <DragSessionCard session={session} key={session.id} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No drag sessions recorded yet.
          </p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
          <ActivitySquare className="w-5 h-5 text-primary-500" /> Dyno Sessions
          <span className="text-muted-foreground text-sm font-normal">
            ({data?.car.dynoSessions?.length ?? 0} total)
          </span>
        </h2>

        {data?.car.dynoSessions?.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.car.dynoSessions.map((session) => (
              <DynoSessionCard
                session={session}
                powerUnit={powerUnit}
                torqueUnit={torqueUnit}
                key={session.id}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No dyno sessions recorded yet.
          </p>
        )}
      </section>
    </div>
  );
}
