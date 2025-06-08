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
import { ComponentProps, useState } from "react";
import { PowerUnit, TorqueUnit } from "@/gql/graphql";
import { powerUnitsShort, torqueUnitsShort } from "@/literals";

import type { Payload } from "recharts/types/component/DefaultLegendContent";
import { cn } from "@heroui/react";
import { getPower } from "@/utils/power";
import { getTorque } from "@/utils/torque";

export default function DynoSessionChart({
  session,
  powerUnit,
  torqueUnit,
  className,
  ...props
}: {
  session: {
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
} & ComponentProps<"div">) {
  const [visible, setVisible] = useState({
    power: true,
    torque: true,
  });

  const handleLegendClick = (e: Payload) => {
    const key = e.dataKey === "powerKw" ? "power" : "torque";
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      className={cn(
        "w-full sm:w-auto min-w-[350px] sm:min-w-0 sm:aspect-video min-h-[200px] sm:min-h-[300px] rounded-2xl bg-primary/5 backdrop-blur-xl px-6 md:px-10 py-8 md:py-12 border border-primary/10 shadow-sm",
        className
      )}
      {...props}
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
        className="min-h-[200px] sm:min-h-0"
      >
        <LineChart
          data={
            session.results
              ?.toSorted((a, b) => a.rpm - b.rpm)
              .map(({ rpm, powerKw, torqueNm }) => ({
                rpm,
                power:
                  powerKw != null ? getPower(powerKw, powerUnit) : undefined,
                torque:
                  torqueNm != null
                    ? getTorque(torqueNm, torqueUnit)
                    : undefined,
              })) ?? []
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
              value: `Power (${powerUnitsShort[powerUnit]})`,
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
              value: `Torque (${torqueUnitsShort[torqueUnit]})`,
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
            dataKey="power"
            stroke="hsl(var(--heroui-primary))"
            strokeWidth={2}
            dot={false}
            name={`Power (${powerUnitsShort[powerUnit]})`}
            hide={!visible.power}
            strokeOpacity={visible.power ? 1 : 0}
            connectNulls
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="torque"
            stroke="hsl(var(--heroui-secondary-400))"
            strokeWidth={2}
            dot={false}
            name={`Torque (${torqueUnitsShort[torqueUnit]})`}
            hide={!visible.torque}
            strokeOpacity={visible.torque ? 1 : 0}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
