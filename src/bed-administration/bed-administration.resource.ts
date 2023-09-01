import useSWR from "swr";
import { FetchResponse, openmrsFetch } from "@openmrs/esm-framework";
import { useMemo } from "react";

interface BedForm {
  bedNumber: string;
  bedType: string;
  row: number;
  column: number;
  status: string;
  locationUuid: string;
}

export async function saveBed({ bedPayload }): Promise<FetchResponse<BedForm>> {
  const response: FetchResponse = await openmrsFetch(`/ws/rest/v1/bed`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: bedPayload,
  });
  return response;
}

export function useBedType() {
  const locationsUrl = `/ws/rest/v1/bedtype`;
  const { data, error, isLoading } = useSWR<{ data }>(
    locationsUrl,
    openmrsFetch
  );

  const bedTypes = useMemo(() => {
    const rawData = data?.data?.results ?? [];
    const uniqueBedTypes = [];

    rawData.forEach((response) => {
      if (!uniqueBedTypes.some((bedType) => bedType.name === response.name)) {
        uniqueBedTypes.push(response);
      }
    });

    return uniqueBedTypes;
  }, [data?.data?.results]);

  return { bedTypes: bedTypes ? bedTypes : [], isLoading, error };
}

export async function editBed({
  bedPayload,
  bedId,
}): Promise<FetchResponse<BedForm>> {
  const response: FetchResponse = await openmrsFetch(
    `/ws/rest/v1/bed/${bedId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: bedPayload,
    }
  );
  return response;
}
