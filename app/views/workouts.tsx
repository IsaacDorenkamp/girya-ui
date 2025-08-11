import { useMemo, useState } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Col } from "react-bootstrap";

import type { Workout } from "../types";
import Loading from "../components/loading";
import WorkoutList from "../components/workout-list";
import useWorkouts from "../hooks/use-workouts";

export default function Workouts() {
	const { data: workouts, isPending: loadingWorkouts } = useWorkouts();

	const byDate: { [key: string]: Workout[] } | undefined = useMemo(() => {
		if (!workouts) return undefined;

		const buckets: { [key: string]: Workout[] } = {};
		for (const workout of workouts) {
			const timestamp = Date.parse(workout.at.split("T")[0]);
			if (buckets[timestamp]) buckets[timestamp].push(workout);
			else buckets[timestamp] = [workout];
		}

		return buckets;
	}, [workouts]);
	const timestamps = useMemo(() => {
		if (!byDate) return [];
		const timestamps = Object.keys(byDate).map(timestampStr => Number.parseInt(timestampStr));
		return timestamps.sort();
	}, [byDate]);

	const [selection, setSelection] = useState<number | undefined>();

	if (selection === undefined && timestamps.length > 0) {
		setSelection(timestamps.at(-1));
	}

	return <>
		<h1>Workouts</h1>
		<hr />
		{loadingWorkouts ? 
			<Loading /> :
			<>
				<Form.Group as={Row} className="mb-3">
					<Form.Label column sm={1} className="text-end">
						Date:
					</Form.Label>
					<Col sm={11}>
						<Form.Select value={selection} onChange={(event) => {
							setSelection(Number.parseInt(event.target.value));
						}}>
							{timestamps.map(timestamp =>
								<option value={timestamp} key={timestamp}>{(new Date(timestamp)).toISOString().split("T")[0]}</option>
							)}
						</Form.Select>
					</Col>
				</Form.Group>
				{selection && byDate?.[selection] && <WorkoutList workouts={byDate[selection]} editable={false} />}
			</>}
	</>;
}
