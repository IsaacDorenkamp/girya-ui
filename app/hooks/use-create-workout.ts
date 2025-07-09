import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Workout } from "../types";
import { useAuthContext } from "../providers/auth-provider";
import { createWorkoutKey } from "../functions/create-query-key";

interface CreateWorkoutOptions {
	at: string;
	split: string;
}

export default function useCreateWorkout() {
	const queryClient = useQueryClient();
	const { client } = useAuthContext();
	return useMutation({
		mutationFn: async ({ at, split }: CreateWorkoutOptions) => {
			const response = await client.post<Workout>(`/api/workouts`, { at, split });
			return response.data;
		},
		onSuccess: (data) => {
			const date = new Date(Date.parse(data.at));
			const key = createWorkoutKey(date);
			queryClient.invalidateQueries({ queryKey: key });
		}
	});
}
