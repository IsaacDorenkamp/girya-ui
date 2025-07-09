export function createWorkoutKey(at?: Date) {
	return ["workouts", at?.toISOString().split("T")[0] ?? "all"];
}

export function createWorkoutSetsKey(workoutSlug: string) {
	return ["workouts", "sets", workoutSlug];
}

export function createLiftKey(slug: string) {
	return ["lifts", slug];
}
