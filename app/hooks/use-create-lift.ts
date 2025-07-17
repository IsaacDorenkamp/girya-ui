import type { AxiosError, AxiosResponse } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuthContext } from "../providers/auth-provider";
import type { LiftInput, Lift, ErrorResponse } from "../types";

export default function useCreateLift() {
	const { client } = useAuthContext();
	const queryClient = useQueryClient();
	return useMutation<Lift, AxiosError<ErrorResponse>, LiftInput>({
		mutationFn: async (lift: LiftInput) => {
			const response = await client.post<LiftInput, AxiosResponse<Lift>>("/api/lifts", lift);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["lifts", "all"],
			});
		}
	});
}
