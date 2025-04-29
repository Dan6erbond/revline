import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  NumberInput,
  Textarea,
  useDisclosure,
} from "@heroui/react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Plus, Trash } from "lucide-react";
import { useMutation, useSuspenseQuery } from "@apollo/client";

import type { Payload } from "recharts/types/component/DefaultLegendContent";
import { graphql } from "@/gql";
import { useRouter } from "next/router";
import { useState } from "react";

const getDynoSession = graphql(`
  query GetDynoSession($id: ID!) {
    dynoSession(id: $id) {
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
`);

type Inputs = {
  rpm: number;
  power: number;
  torque: number;
};

const createDynoResult = graphql(`
  mutation CreateDynoResult($input: CreateDynoResultInput!) {
    createDynoResult(input: $input) {
      id
      rpm
      powerKw
      torqueNm
    }
  }
`);

export default function Session() {
  const router = useRouter();

  const { data } = useSuspenseQuery(getDynoSession, {
    variables: {
      id: router.query.tab![1],
    },
  });

  const [visible, setVisible] = useState({
    power: true,
    torque: true,
  });

  const handleLegendClick = (e: Payload) => {
    console.log(e);
    const key = e.dataKey === "powerKw" ? "power" : "torque";
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const { handleSubmit, control } = useForm<Inputs>({
    defaultValues: {},
  });

  const [mutate] = useMutation(createDynoResult, {
    update(cache, res) {
      if (!res.data?.createDynoResult || !data.dynoSession) return;

      cache.writeQuery({
        query: getDynoSession,
        variables: {
          id: router.query.tab![1],
        },
        data: {
          ...data,
          dynoSession: {
            ...data.dynoSession,
            results: [
              ...(data.dynoSession.results ?? []),
              res.data.createDynoResult,
            ],
          },
        },
      });
    },
  });

  const onSubmit: SubmitHandler<Inputs> = ({ rpm, power, torque }) => {
    mutate({
      variables: {
        input: {
          sessionID: router.query.tab![1],
          rpm,
          powerKw: power,
          torqueNm: torque,
        },
      },
    }).then(() => {
      onClose();
    });
  };

  return (
    <div className="flex flex-col gap-8 max-w-screen-xl mx-auto">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl">{data?.dynoSession?.title}</h2>
        <form>
          <Textarea
            label="Notes"
            defaultValue={data.dynoSession?.notes ?? undefined}
            isDisabled
            variant="bordered"
          />
        </form>
      </div>
      <div className="flex justify-between">
        <h3 className="text-xl">Results</h3>
        <Button isIconOnly variant="bordered" radius="full" onPress={onOpen}>
          <Plus />
        </Button>
      </div>

      <div className="aspect-video min-h-[300px] rounded-2xl bg-primary/5 backdrop-blur-xl px-6 md:px-10 py-8 md:py-12 border border-primary/10 shadow-sm">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={
              data.dynoSession.results?.toSorted((a, b) => a.rpm - b.rpm) ?? []
            }
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200" />
            <XAxis
              dataKey="rpm"
              tick={{ fill: "hsl(var(--heroui-foreground))" }}
              label={{
                value: "RPM",
                position: "insideBottom",
                offset: -10,
                fill: "hsl(var(--heroui-foreground))",
              }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: "hsl(var(--heroui-primary))" }}
              label={{
                value: "Power (kW)",
                angle: -90,
                position: "insideLeft",
                offset: 10,
                fill: "hsl(var(--heroui-primary))",
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "hsl(var(--heroui-secondary-400))" }}
              label={{
                value: "Torque (Nm)",
                angle: -90,
                position: "insideRight",
                offset: 10,
                fill: "hsl(var(--heroui-secondary-400))",
              }}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(var(--heroui-background))",
                color: "hsl(var(--heroui-foreground))",
              }}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ paddingTop: 16, cursor: "pointer" }}
              onClick={handleLegendClick}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="powerKw"
              stroke="hsl(var(--heroui-primary))"
              strokeWidth={2}
              dot={false}
              name="Power (kW)"
              hide={!visible.power}
              strokeOpacity={visible.power ? 1 : 0}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="torqueNm"
              stroke="hsl(var(--heroui-secondary-400))"
              strokeWidth={2}
              dot={false}
              name="Torque (Nm)"
              hide={!visible.torque}
              strokeOpacity={visible.torque ? 1 : 0}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {data.dynoSession?.results
          ?.toSorted((a, b) => a.rpm - b.rpm)
          .map((r) => (
            <Card key={r.id}>
              <CardHeader className="flex justify-between">
                <p>{r.rpm} RPM</p>
                <Button
                  isIconOnly
                  variant="bordered"
                  color="danger"
                  size="sm"
                  isDisabled
                >
                  <Trash size={16} />
                </Button>
              </CardHeader>
              <CardFooter className="flex flex-col gap-2 items-start min-w-[200px]">
                <p>{r.powerKw} kW</p>
                <p>{r.torqueNm} Nm</p>
              </CardFooter>
            </Card>
          ))}
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Enter result</ModalHeader>
              <ModalBody>
                <form
                  id="result-form"
                  className="flex flex-col gap-4"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Controller
                    control={control}
                    name="rpm"
                    render={({ field: { onChange, ...field } }) => (
                      <NumberInput
                        endContent={"RPM"}
                        {...field}
                        onValueChange={onChange}
                        variant="bordered"
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="power"
                    render={({ field: { onChange, ...field } }) => (
                      <NumberInput
                        label="Power"
                        endContent={"kW"}
                        {...field}
                        onValueChange={onChange}
                        variant="bordered"
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="torque"
                    render={({ field: { onChange, ...field } }) => (
                      <NumberInput
                        label="Torque"
                        endContent={"Nm"}
                        {...field}
                        onValueChange={onChange}
                        variant="bordered"
                      />
                    )}
                  />
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit" form="result-form">
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
