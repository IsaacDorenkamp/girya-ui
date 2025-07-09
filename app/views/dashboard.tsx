import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import useWorkouts from "../hooks/use-workouts";
import useCreateWorkout from "../hooks/use-create-workout";
import Loading from "../components/loading";
import WorkoutList from "../components/workout-list";

export default function Dashboard() {
	const [date, setDate] = useState<Date>(new Date());
	const { data: workouts, isPending: workoutsPending, error } = useWorkouts(date);
	const { mutate: createWorkout, isPending: creatingWorkout } = useCreateWorkout();
	return <Container>
		<h1>Today's Workout</h1>
		<hr />
		{workouts ? <WorkoutList workouts={workouts} />
			: (error
				? error.response?.data.detail ?? "Unknown Error"
				: (workoutsPending ? <Loading /> : "Something went wrong."))}
		<Button disabled={creatingWorkout} onClick={() => {
			createWorkout({ at: date.toISOString().split("T")[0], split: "upper-body" });
		}}>{creatingWorkout ? "Starting..." : "Start New Workout"}</Button>
	</Container>;
}
