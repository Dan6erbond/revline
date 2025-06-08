import { categoryColors, categoryIcons, categoryLabels } from "./shared";

import { Chip } from "@heroui/react";
import { ModCategory } from "@/gql/graphql";

export default function ModCategoryChip({
  category,
}: {
  category: ModCategory;
}) {
  const CategoryIcon = categoryIcons[category];

  return (
    <Chip
      startContent={<CategoryIcon className="h-3.5 w-3.5 ml-1" />}
      color={categoryColors[category]}
    >
      {categoryLabels[category]}
    </Chip>
  );
}
