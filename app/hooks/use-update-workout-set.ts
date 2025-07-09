import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Set, SetInput } from "../types";
import { useAuthContext } from "../providers/auth-provider";
import { createWorkoutSetsKey } from "../functions/create-query-key";
import { exclude } from "../functions/object";

interface SetUpdateInput {
	set_id: number;
	set: SetInput;
}

export default function useUpdateWorkoutSet(workout: string) {
	const { client } = useAuthContext();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ set_id, set }: SetUpdateInput) => {
			const response = await client.put<Set>(`/api/sets/${set_id}`, exclude(set, "id"));
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: createWorkoutSetsKey(workout),
			});
		}
	});
}
