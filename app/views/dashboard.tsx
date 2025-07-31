import { useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import useWorkouts from "../hooks/use-workouts";
import useCreateWorkout from "../hooks/use-create-workout";
import useSplits from "../hooks/use-splits";
import usePreviousValue from "../hooks/use-previous-value";
import Loading from "../components/loading";
import WorkoutList from "../components/workout-list";

export default function Dashboard() {
	const date = useMemo(() => new Date(), []);
	const { data: splits, isPending: loadingSplits } = useSplits();
	const { data: workouts, isPending: workoutsPending, error: workoutError } = useWorkouts(date);
	const { mutate: createWorkout, isPending: creatingWorkout } = useCreateWorkout();

	const [split, setSplit] = useState<string | undefined>();
	const [,splitsChanged] = usePreviousValue(splits);
	if (splitsChanged && splits && split === undefined) {
		setSplit(splits[0]?.slug);
	}

	return <>
		<h1>Today's Workout{workouts && workouts.length > 1 ? "s" : ""}</h1>
		<hr />
		{workouts ? <WorkoutList workouts={workouts} />
			: (workoutError
				? (workoutError.response?.data.detail ?? "Something went wrong.")
				: (workoutsPending ? <><Loading /><br /></> : "Something went wrong."))}
		{(workouts?.length ?? 0) === 0 ?
			<div className="d-flex flex-row">
				<div className="flex-grow-1 pe-3">
					{loadingSplits ? <Loading /> : <Form.Select value={split ?? ""} onChange={(event) => setSplit(event.target.value)}>
						{splits ? splits.map(split => <option value={split.slug}>{split.name}</option>) : <option disabled value="">Failed to fetch splits</option>}
					</Form.Select>}
				</div>
				<div>
					<Button disabled={creatingWorkout || !splits || !split} onClick={() => {
						createWorkout({ at: date.toISOString().split("T")[0], split: split! });
					}}>{creatingWorkout ? "Starting..." : "Start New Workout"}</Button>
				</div>
			</div>
			: undefined}
	</>;
}
