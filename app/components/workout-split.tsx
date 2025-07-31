import { useMemo } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

import type { Workout, Set } from "../types";

import Loading from "./loading";
import WorkoutLift from "./workout-lift";
import useWorkoutSets from "../hooks/use-workout-sets";
import useDeleteWorkout from "../hooks/use-delete-workout";

interface WorkoutSplitProps {
	workout: Workout;
}

export default function WorkoutSplit({ workout }: WorkoutSplitProps) {
	const { data: sets, isPending: setsPending, error } = useWorkoutSets(workout.slug);
	const { mutate: deleteWorkout, isPending: deletingWorkout } = useDeleteWorkout();
	const setBuckets = useMemo(() => {
		if (!sets) return {};
		const buckets: { [key: string]: Set[] } = {};
		for (const set of sets) {
			let bucket = buckets[set.lift.slug];
			if (!bucket) {
				bucket = [];
				buckets[set.lift.slug] = bucket;
			}
			bucket.push(set);
		}
		return buckets;
	}, [sets]);

	if (sets) {
		return <>
			{workout.split.lifts.map((lift, index) => {
				const key = `lift-${lift.slug}`;
				return <WorkoutLift lift={lift} sets={setBuckets[lift.slug] ?? []} workout={workout.slug} key={key}
					className={index > 0 ? "mt-3" : undefined} />;
			})}
			{workout.split.lifts.length === 0 && <Alert variant="danger" className="mb-0">This split has no lifts!</Alert>}
			<Button variant="danger" onClick={() => deleteWorkout(workout)} disabled={deletingWorkout} className="mt-3 float-end">
				{deletingWorkout ? "Deleting..." : "Delete Workout"}
			</Button>
		</>;
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
