import { statusColors, statusIcons, statusLabels } from "@/mods/shared";

import { Chip } from "@heroui/react";
import { ModStatus } from "../gql/graphql";

export default function ModStatusChip({ status }: { status: ModStatus }) {
  const StatusIcon = statusIcons[status];

  return (
    <Chip
      startContent={<StatusIcon className="h-3.5 w-3.5 ml-1" />}
      color={statusColors[status]}
    >
      {statusLabels[status]}
    </Chip>
  );
}
