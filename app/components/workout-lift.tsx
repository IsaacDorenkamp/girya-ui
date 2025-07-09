import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

import type { Lift, Set } from "../types";
import useCreateWorkoutSet from "../hooks/use-create-workout-set";
import WorkoutSet from "./workout-set";

interface WorkoutLiftProps {
	workout: string;
	sets: Set[];  // filtered list of sets
	lift: Lift;
}

export default function WorkoutLift({ workout, sets, lift }: WorkoutLiftProps) {
	const { mutate: createSet, isPending: creatingSet } = useCreateWorkoutSet();
	return <Accordion defaultActiveKey="item">
		<Accordion.Item eventKey="item">
			<Accordion.Header><h5>{lift.name}&nbsp;<i className="text-muted">({sets.length} set{sets.length !== 1 ? "s" : ""})</i></h5></Accordion.Header>
			<Accordion.Body>
				{sets.length > 0 ? <Table>
					<thead>
						<tr>
							<td>Reps</td>
							<td>Weight</td>
							<td></td>
							<td></td>
						</tr>
					</thead>
					<tbody>
						{sets.map(set => <WorkoutSet set={set} workout={workout} key={`set-${set.id}`} />)}
					</tbody>
				</Table>: <div className="mb-3">No sets recorded.</div>}
				<Button disabled={creatingSet} onClick={() => {
					createSet({
						workout,
						lift: lift.slug,
					});
				}}>{creatingSet ? "Adding..." : "Add Set"}</Button>
			</Accordion.Body>
		</Accordion.Item>
	</Accordion>;
}
