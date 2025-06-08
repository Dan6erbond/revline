import {
  ActivitySquare,
  FileText,
  Gauge,
  LineChart,
  Timer,
} from "lucide-react";
import {
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
import {
  DragResultUnit,
  GetPublicCarOverviewQuery,
  PowerUnit,
  TorqueUnit,
} from "@/gql/graphql";

import DynoSessionChart from "../performance/dyno-sessions/chart";
import ModChip from "../../mods/chip";
import { createExtensions } from "../minimal-tiptap/hooks/use-minimal-tiptap";
import { generateHTML } from "@tiptap/react";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { resolveDragResultType } from "@/utils/drag-session";
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
        mods {
          id
          title
          category
          status
          description
          stage
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
        isPressable={!!session.results && session.results?.length > 0}
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
          {session.results && session.results?.length > 0 && (
            <span className="text-xs text-muted tracking-tight">
              ↗ View results
            </span>
          )}
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
  session: NonNullable<
    GetPublicCarOverviewQuery["car"]["dynoSessions"]
  >[number];
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

      <CardBody className="text-sm text-muted-foreground flex items-start gap-2">
        {session.notes && (
          <>
            <FileText className="w-4 h-4 mt-0.5 text-muted" />
            <span
              className="line-clamp-2"
              dangerouslySetInnerHTML={{
                __html: generateHTML(session.notes, createExtensions("")),
              }}
            />
          </>
        )}
        {session.results && session.results.length > 0 ? (
          <DynoSessionChart
            session={session}
            className="my-4 mx-auto"
            {...props}
          />
        ) : (
          <div className="my-4 w-full min-h-[300px] flex items-center justify-center rounded-md border border-dashed border-gray-300 bg-muted text-muted-foreground">
            <div className="flex flex-col items-center gap-2 text-center">
              <LineChart className="h-8 w-8 text-gray-400" />
              <div className="text-sm font-medium">No results yet</div>
              <div className="text-xs text-gray-500">
                Once data is available, a chart will appear here.
              </div>
            </div>
          </div>
        )}

        {session.mods && session.mods.length > 0 && (
          <div className="space-y-2">
            <p>Mods</p>
            <div className="flex flex-wrap gap-2">
              {session.mods.map((mod) => (
                <ModChip key={mod.id} variant="faded" mod={mod} />
              ))}
            </div>
          </div>
        )}
      </CardBody>

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

  const { data } = useQuery(getPublicCarOverview, {
    variables: {
      id: getQueryParam(router.query.id) as string,
    },
    skip: !router.query.id,
  });

  const { powerUnit, torqueUnit } = useUnits(data?.me?.settings);

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
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
