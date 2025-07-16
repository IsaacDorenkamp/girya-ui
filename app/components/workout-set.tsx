import React, { useCallback, useState } from "react";
import Button from "react-bootstrap/Button";

import type { Set } from "../types";
import useDeleteWorkoutSet from "../hooks/use-delete-workout-set";
import useUpdateWorkoutSet from "../hooks/use-update-workout-set";

interface WorkoutSetProps {
	set: Set;
	workout: string;
}

export default function WorkoutSet({ set, workout }: WorkoutSetProps) {
	const [editing, setEditing] = useState<boolean>(false);
	const [reps, setReps] = useState<number | undefined>(set.reps);
	const [weight, setWeight] = useState<number | undefined>(set.weight);

	const { mutate: deleteSet, isPending: deletingSet } = useDeleteWorkoutSet(workout);
	const { mutate: updateSet, isPending: updatingSet } = useUpdateWorkoutSet(workout);

	const [prevUpdatingSet, setPrevUpdatingSet] = useState<boolean>(updatingSet);

	if (prevUpdatingSet !== updatingSet) {
		if (!updatingSet) {
			setEditing(false);
		}
		setPrevUpdatingSet(updatingSet);
	}

	const valid = reps !== undefined && weight !== undefined;

	// callbacks
	const toggleEditing = useCallback(() => {
		if (editing) {
			if (valid) {
				updateSet({
					set_id: set.id,
					set: {
						lift: set.lift.slug,
						reps,
						weight,
						weight_unit: set.weight_unit,
					}
				});
			}
		} else {
			setEditing(true);
		}
	}, [editing, reps, weight, set, valid]);
	const updateReps = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		let numerical: number | undefined = Number.parseInt(event.target.value);
		if (Number.isNaN(numerical)) {
			numerical = undefined;
		}
		setReps(numerical);
	}, []);
	const updateWeight = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		let numerical: number | undefined = Number.parseInt(event.target.value);
		if (Number.isNaN(numerical)) {
			numerical = undefined
		}
		setWeight(numerical);
	}, []);

	return <tr key={`set-${set.id}`}>
		<td className="align-middle">
			{editing ? <input type="number" value={reps ?? ""} onChange={updateReps} /> : set.reps}
		</td>
		<td className="align-middle">
			{editing ? <input type="number" value={weight ?? ""} onChange={updateWeight} /> : set.weight}
			{set.weight_unit}
		</td>
		<td className="align-middle">
			<Button onClick={toggleEditing} disabled={editing && !valid}>
				{updatingSet ? "Saving..." : (editing ? "Save" : "Edit")}
			</Button>
		</td>
		<td className="align-middle">
			<Button onClick={() => deleteSet(set.id)} disabled={deletingSet} variant="danger">
				{deletingSet ? "Deleting..." : "Delete"}
			</Button>
		</td>
	</tr>;
}
