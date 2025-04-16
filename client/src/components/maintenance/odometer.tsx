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
import { useMutation, useQuery } from "@apollo/client";

import { Plus } from "lucide-react";
import { getQueryParam } from "../../utils/router";
import { graphql } from "../../gql";
import { useRouter } from "next/router";

const getOdometerReadings = graphql(`
  query GetOdometerReadings($id: ID!) {
    car(id: $id) {
      id
      odometerReadings {
        id
        readingKm
        createdAt
        notes
      }
    }
  }
`);

type Inputs = {
  readingKm: number;
  notes: string;
  locationLat: number;
  locationLng: number;
};

const createOdometerReading = graphql(`
  mutation CreateOdometerReading($input: CreateOdometerReadingInput!) {
    createOdometerReading(input: $input) {
      id
      readingKm
      createdAt
      notes
    }
  }
`);

const columns = [
  { key: "readingKm", label: "Reading (km)" },
  { key: "createdAt", label: "Created At" },
  { key: "notes", label: "Notes" },
];

export default function Odometer() {
  const router = useRouter();

  const { data } = useQuery(getOdometerReadings, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

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
              ...data.car.odometerReadings,
              res.data.createOdometerReading,
            ],
          },
        },
      });
    },
  });

  const onSubmit: SubmitHandler<Inputs> = ({
    readingKm,
    locationLat,
    locationLng,
  }) => {
    mutate({
      variables: {
        input: {
          carId: getQueryParam(router.query.id)!,
          readingKm,
          locationLat,
          locationLng,
        },
      },
    }).then(({ data }) => {
      if (!data) return;

      onClose();
    });
  };

  return (
    <div className="flex flex-col gap-4 md:gap-8 pt-4 md:pt-8">
      <div className="flex justify-between">
        <div></div>
        <div>
          <Button onPress={onOpen} startContent={<Plus />} className="self-end">
            Add
          </Button>
        </div>
      </div>
      <div className="h-[250] md:h-[350] lg:h-[450] bg-primary-50/30 backdrop-blur-2xl rounded-lg px-4 md:px-8 py-8 md:py-12 light">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data?.car?.odometerReadings.map((or) => ({
              ...or,
              createdAt: new Date(or.createdAt).toLocaleDateString(),
            }))}
          >
            <XAxis
              dataKey="createdAt"
              tick={{ fill: "hsl(var(--heroui-foreground))" }}
              stroke="hsl(var(--heroui-foreground))"
            />
            <YAxis
              type="number"
              dataKey="readingKm"
              unit="km"
              tick={{ fill: "hsl(var(--heroui-foreground))" }}
              stroke="hsl(var(--heroui-foreground))"
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--heroui-background))",
                color: "hsl(var(--heroui-foreground))",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="readingKm"
              stroke="hsl(var(--heroui-primary-400))"
              dot={{ r: 5, strokeWidth: 3 }}
              strokeWidth={3}
              unit="km"
              name="Reading"
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
              <TableCell>{or.readingKm}</TableCell>
              <TableCell>
                {new Date(or.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>{or.notes}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
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
                    endContent={"km"}
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
