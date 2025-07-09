import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuthContext } from "../providers/auth-provider";
import { createWorkoutSetsKey } from "../functions/create-query-key";

export default function useDeleteWorkoutSet(workout: string) {
	const { client } = useAuthContext();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (set_id: number) => {
			const response = await client.delete(`/api/sets/${set_id}`);
			return response.data;
		},
		onSuccess: async () => {
			queryClient.invalidateQueries({ queryKey: createWorkoutSetsKey(workout) });
		},
		mutationKey: [workout],
	});
}
