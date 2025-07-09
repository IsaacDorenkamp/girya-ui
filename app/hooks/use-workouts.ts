import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

import { useAuthContext } from "../providers/auth-provider";
import type { Workout } from "../types";
import { createWorkoutKey } from "../functions/create-query-key";

export default function useWorkouts(at?: Date) {
	const { client } = useAuthContext();
	return useQuery<Workout[], AxiosError<{ detail: string }>>({
		queryFn: async () => {
			let url = "/api/workouts";
			if (at) {
				url += `?at=${encodeURIComponent(at.toISOString().split("T")[0])}`;
			}
			const response = await client.get<Workout[]>(url);
			return response.data;
		},
		queryKey: createWorkoutKey(at),
	});
}
