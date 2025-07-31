import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Workout } from "../types";
import { useAuthContext } from "../providers/auth-provider";
import { createWorkoutKey } from "~/functions/create-query-key";

export default function useDeleteWorkout() {
	const { client } = useAuthContext();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (workout: Workout) => {
			// first, execute delete request
			await client.delete(`/api/workouts/${workout.slug}`);
		},
		onSuccess: (_, workout: Workout) => {
			const at = new Date(Date.parse(workout.at));
			queryClient.invalidateQueries({
				queryKey: createWorkoutKey(at),
			});
		}
	});
}
