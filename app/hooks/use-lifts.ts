import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { Lift, ErrorResponse } from "../types";
import { useAuthContext } from "../providers/auth-provider";

export default function useLifts() {
	const { client } = useAuthContext();
	return useQuery<Lift[], AxiosError<ErrorResponse>>({
		queryFn: async () => {
			const response = await client.get("/api/lifts");
			return response.data.lifts;
		},
		queryKey: ["lifts", "all"]
	});
}
