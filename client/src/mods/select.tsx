import { ModCategory, ModStatus } from "@/gql/graphql";
import { Select, SelectItem, SelectProps } from "@heroui/react";

import { getQueryParam } from "@/utils/router";
import { graphql } from "@/gql";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

const getMods = graphql(`
  query Mods($id: ID!) {
    car(id: $id) {
      id
      mods {
        id
        title
        stage
        category
        status
        description
        productOptions {
          id
        }
      }
    }
  }
`);

export default function ModsSelect({
  filterMods,
  ...props
}: {
  filterMods?(mod: {
    __typename?: "Mod";
    id: string;
    title: string;
    stage?: string | null;
    category: ModCategory;
    status: ModStatus;
    description?: string | null;
    productOptions?: Array<{
      __typename?: "ModProductOption";
      id: string;
    }> | null;
  }): boolean;
} & Omit<SelectProps, "items" | "children">) {
  const router = useRouter();

  const { data: modsData } = useQuery(getMods, {
    variables: { id: getQueryParam(router.query.id) as string },
    skip: !getQueryParam(router.query.id),
  });

  return (
    <Select
      placeholder="Add Mod"
      classNames={{ innerWrapper: "py-4" }}
      items={
        (filterMods
          ? modsData?.car.mods?.filter(filterMods)
          : modsData?.car.mods) ?? []
      }
      {...props}
    >
      {({ id, title, category, stage, productOptions }) => (
        <SelectItem key={id} textValue={title}>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">{title}</span>
            <div className="text-xs text-default-500 flex flex-wrap gap-3">
              {category && <span>Category: {category}</span>}
              {stage && <span>Stage: {stage}</span>}
              <span>{productOptions?.length || 0} Options</span>
            </div>
          </div>
        </SelectItem>
      )}
    </Select>
  );
}
