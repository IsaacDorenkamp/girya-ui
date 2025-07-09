import Alert from "react-bootstrap/Alert";

import type { Workout } from "../types";

import Loading from "./loading";
import WorkoutLift from "./workout-lift";
import useWorkoutSets from "../hooks/use-workout-sets";

interface WorkoutSplitProps {
	workout: Workout;
}

export default function WorkoutSplit({ workout }: WorkoutSplitProps) {
	const { data: sets, isPending: setsPending, error } = useWorkoutSets(workout.slug);
	if (sets) {
		return workout.split.lifts.map((lift) => {
			const key = `lift-${lift.slug}`;
			return <WorkoutLift lift={lift} sets={sets} workout={workout.slug} key={key} />;
		});
	} else {
		if (error) {
			return <Alert variant="danger">Could not fetch sets for this lift.</Alert>
		} else if (setsPending) {
			return <Loading />;
		} else {
			return "Something went wrong.";
		}
	}
}
