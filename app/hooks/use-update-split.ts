import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { SplitInput } from "../types";
import { useAuthContext } from "../providers/auth-provider";

interface UpdateSplit {
	split: SplitInput;
	slug: string;
}

export default function useUpdateSplit() {
	const { client } = useAuthContext();
	const query = useQueryClient();
	return useMutation({
		mutationFn: async (split: UpdateSplit) => {
			const response = await client.put(`/api/splits/${split.slug}`, split.split);
			return response.data;
		},
		onSuccess: () => {
			query.invalidateQueries({
				queryKey: ["splits"],
			});
		}
	});
}
