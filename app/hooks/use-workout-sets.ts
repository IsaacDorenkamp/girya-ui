import { useQuery } from "@tanstack/react-query";

import type { Set } from "../types";
import { useAuthContext } from "../providers/auth-provider";
import { createWorkoutSetsKey } from "../functions/create-query-key";

export default function useWorkoutSets(workoutSlug: string) {
	const { client } = useAuthContext();
	return useQuery({
		queryFn: async () => {
			const response = await client.get<Set[]>(`/api/workouts/${workoutSlug}/sets`);
			return response.data;
		},
		queryKey: createWorkoutSetsKey(workoutSlug),
	});
}
