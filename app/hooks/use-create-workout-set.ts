import { useMutation, useQueryClient } from "@tanstack/react-query";

import { WeightUnit, type Set } from "../types";
import { useAuthContext } from "../providers/auth-provider";
import { createWorkoutSetsKey } from "../functions/create-query-key";

interface SetInput {
	workout: string;
	lift: string;
	reps?: number;
	weight?: number;
	weight_unit?: WeightUnit;
}

export default function useCreateWorkoutSet() {
	const { client } = useAuthContext();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ workout, lift, reps = 0, weight = 0, weight_unit = WeightUnit.lb }: SetInput) => {
			const response = await client.post<Set>(`/api/sets`, {
				workout: workout,
				lift: lift,
				reps,
				weight,
				weight_unit
			});
			return response.data;
		},
		onSuccess: (_: Set, variables: SetInput) => {
			const workoutSetsKey = createWorkoutSetsKey(variables.workout);
			queryClient.invalidateQueries({ queryKey: workoutSetsKey });
		}
	});
}
