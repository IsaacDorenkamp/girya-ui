import type { AxiosError, AxiosResponse } from "axios";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import type { ErrorResponse, LiftInput, Lift } from "../types";
import { useAuthContext } from "../providers/auth-provider";

export interface UpdateLiftInput {
	slug: string;
	lift: LiftInput;
}

export default function useUpdateLift() {
	const { client } = useAuthContext();
	const queryClient = useQueryClient();
	return useMutation<Lift, AxiosError<ErrorResponse>, UpdateLiftInput>({
		mutationFn: async ({ slug, lift }: UpdateLiftInput) => {
			const response = await client.put<LiftInput, AxiosResponse<Lift>>(`/api/lifts/${slug}`, lift);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["lifts"],
			});
		},
	});
}
