import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { SplitInput, Split, ErrorResponse } from "../types";
import { useAuthContext } from "../providers/auth-provider";

export default function useCreateSplit() {
	const { client } = useAuthContext();
	const queryClient = useQueryClient();
	return useMutation<Split, AxiosError<ErrorResponse>, SplitInput>({
		mutationFn: async (split: SplitInput) => {
			const response = await client.post<Split>(`/api/splits`, split);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["splits"]
			});
		},
	});
}
