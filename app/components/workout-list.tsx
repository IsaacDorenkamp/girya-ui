import Container from "react-bootstrap/Container";

import type { Workout } from "../types";
import WorkoutSplit from "./workout-split";

interface WorkoutListProps {
	workouts: Workout[];
	editable?: boolean;
}

export default function WorkoutList({ workouts, editable = true }: WorkoutListProps) {
	let content;
	if (workouts.length == 0) {
		content = <i>No workouts available.</i>;
	} else {
		content = workouts.sort((a, b) => {
			const a_date = new Date(Date.parse(a.at));
			const b_date = new Date(Date.parse(b.at));
			return b_date.getTime() - a_date.getTime();
		}).map((workout) => {
			return <WorkoutSplit workout={workout} key={`workout-${workout.slug}`} editable={editable} />;
		});
	}
	return <Container className="mx-0 px-0 mb-3">
		{content}
	</Container>;
}
