import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import {
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SubmitHandler, useForm } from "react-hook-form";
import { getDistance, getKilometers } from "@/utils/distance";
import { useMutation, useQuery } from "@apollo/client";

import { DistanceUnit } from "@/gql/graphql";
import { Plus } from "lucide-react";
import { distanceUnits } from "@/literals";
import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { useRouter } from "next/router";

const getOdometerReadings = graphql(`
  query GetOdometerReadings($id: ID!) {
    me {
      id
      profile {
        id
        distanceUnit
      }
    }
    car(id: $id) {
      id
      odometerReadings {
        id
        readingKm
        createTime
        notes
      }
    }
  }
`);

type Inputs = {
  readingKm: number;
  notes: string;
};

const createOdometerReading = graphql(`
  mutation CreateOdometerReading($input: CreateOdometerReadingInput!) {
    createOdometerReading(input: $input) {
      id
      readingKm
      createTime
      notes
    }
  }
`);

const columns = [
  { key: "readingKm", label: "Reading" },
  { key: "createdTime", label: "Created At" },
  { key: "notes", label: "Notes" },
];

export default function Odometer() {
  const router = useRouter();

  const { data } = useQuery(getOdometerReadings, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  const distanceUnit = data?.me?.profile?.distanceUnit ?? DistanceUnit.Miles;

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const { register, handleSubmit } = useForm<Inputs>({
    defaultValues: {},
  });

  const [mutate] = useMutation(createOdometerReading, {
    update: (cache, res) => {
      if (!res.data?.createOdometerReading || !data?.car) return;

      cache.writeQuery({
        query: getOdometerReadings,
        variables: { id: getQueryParam(router.query.id) as string },
        data: {
          ...data,
          car: {
            ...data.car,
            odometerReadings: [
              ...(data.car.odometerReadings ?? []),
              res.data.createOdometerReading,
            ],
          },
        },
      });
    },
  });

  const onSubmit: SubmitHandler<Inputs> = ({ readingKm }) => {
    mutate({
      variables: {
        input: {
          carID: getQueryParam(router.query.id)!,
          readingKm: getKilometers(readingKm, distanceUnit),
        },
      },
    }).then(({ data }) => {
      if (!data) return;

      onClose();
    });
  };

  return (
    <div className="flex flex-col gap-4 md:gap-8 pt-4 md:pt-8 max-w-screen-xl mx-auto">
      <div className="flex justify-between">
        <div></div>
        <div>
          <Button onPress={onOpen} startContent={<Plus />} className="self-end">
            Add
          </Button>
        </div>
      </div>
      <div className="aspect-video min-h-[300px] rounded-2xl bg-primary/5 backdrop-blur-xl px-6 md:px-10 py-8 md:py-12 border border-primary/10 shadow-sm">
        <ResponsiveContainer>
          <ComposedChart
            data={data?.car?.odometerReadings?.map((or) => ({
              ...or,
              createdTime: new Date(or.createTime).toLocaleDateString(),
              reading: getDistance(or.readingKm, distanceUnit),
            }))}
            margin={{ top: 20, right: 30, bottom: 20, left: 0 }}
          >
            <XAxis
              dataKey="createdTime"
              tick={{ fill: "hsl(var(--heroui-foreground))", fontSize: 12 }}
              stroke="hsl(var(--heroui-foreground))"
              axisLine={{
                stroke: "hsl(var(--heroui-foreground))",
                strokeWidth: 1,
              }}
              tickLine={{
                stroke: "hsl(var(--heroui-foreground))",
                strokeWidth: 1,
              }}
            />
            <YAxis
              type="number"
              dataKey="reading"
              unit={distanceUnits[distanceUnit]}
              tick={{ fill: "hsl(var(--heroui-foreground))", fontSize: 12 }}
              stroke="hsl(var(--heroui-foreground))"
              axisLine={{
                stroke: "hsl(var(--heroui-foreground))",
                strokeWidth: 1,
              }}
              tickLine={{
                stroke: "hsl(var(--heroui-foreground))",
                strokeWidth: 1,
              }}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--heroui-background))",
                color: "hsl(var(--heroui-foreground))",
                border: "1px solid hsl(var(--heroui-primary-100))",
                fontSize: "0.875rem",
              }}
              labelStyle={{ color: "hsl(var(--heroui-foreground))" }}
              cursor={{
                stroke: "hsl(var(--heroui-primary-200))",
                strokeWidth: 1,
              }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: 16,
                color: "hsl(var(--heroui-foreground))",
                fontSize: "0.875rem",
              }}
            />
            <Line
              type="monotone"
              dataKey="reading"
              stroke="hsl(var(--heroui-primary-400))"
              dot={{
                r: 4,
                strokeWidth: 2,
                fill: "white",
                stroke: "hsl(var(--heroui-primary-400))",
              }}
              strokeWidth={3}
              unit={distanceUnits[distanceUnit]}
              name="Odometer"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <Table isHeaderSticky>
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={data?.car?.odometerReadings ?? []}
          emptyContent={"No rows to display."}
        >
          {(or) => (
            <TableRow key={or.id}>
              <TableCell>{`${getDistance(
                or.readingKm,
                distanceUnit
              ).toLocaleString()} ${distanceUnits[distanceUnit]}`}</TableCell>
              <TableCell>
                {new Date(or.createTime).toLocaleDateString()}
              </TableCell>
              <TableCell>{or.notes}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Enter Odometer reading</ModalHeader>
              <ModalBody>
                <form
                  id="fuel-up"
                  className="flex flex-col gap-4"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Input
                    type="number"
                    label="Odometer"
                    endContent={distanceUnits[distanceUnit]}
                    {...register("readingKm", { valueAsNumber: true })}
                    variant="bordered"
                  />
                  <Textarea
                    label="Notes"
                    {...register("notes")}
                    variant="bordered"
                  />
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit" form="fuel-up">
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
