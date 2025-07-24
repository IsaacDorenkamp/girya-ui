import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { Split, ErrorResponse } from "../types";
import { useAuthContext } from "../providers/auth-provider";

export default function useSplits() {
	const { client } = useAuthContext();
	return useQuery<Split[], AxiosError<ErrorResponse>>({
		queryKey: ["splits", "all"],
		queryFn: async () => {
			const response = await client.get<Split[]>("/api/splits");
			return response.data;
		},
	});
}
