import { type ChangeEvent, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";

import type { Lift } from "../types";
import LiftItem from "../components/lift-item";
import useCreateLift from "../hooks/use-create-lift";


interface LiftListProps {
	lifts: Lift[];
	creating?: boolean;
	setCreating?: (value: boolean) => void;
}

export default function LiftList({ lifts, creating, setCreating }: LiftListProps) {
	const [slug, setSlug] = useState<string>("");
	const [name, setName] = useState<string>("");

	const [prevCreating, setPrevCreating] = useState<boolean | undefined>(creating);
	if (prevCreating !== creating) {
		setPrevCreating(creating);
		if (creating) {
			setSlug("");
			setName("");
		}
	}

	const updateSlug = (event: ChangeEvent<HTMLInputElement>) => {
		setSlug(event.target.value);
	};

	const updateName = (event: ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value);
	};

	const newLiftValid = !!(slug && name);
	const { mutate: createLift, isPending: creatingLift, error: createError,
		reset: resetCreate, isSuccess: liftCreated } = useCreateLift();

	const [prevCreatingLift, setPrevCreatingLift] = useState<boolean>(creatingLift);
	if (prevCreatingLift !== creatingLift) {
		setPrevCreatingLift(creatingLift);
		if (!creatingLift && liftCreated) {
			setCreating && setCreating(false);
		}
	}

	return (lifts.length === 0 && !creating) ? <><i>No lifts.</i><br /></> : 
	<>
		{createError?.response?.data && <Alert variant="danger" onClose={resetCreate} dismissible>
			{createError.response.data.detail}
		</Alert>}
		{liftCreated && <Alert variant="success" onClose={resetCreate} dismissible>
			Lift created.
		</Alert>}
		<Table>
			<thead>
				<tr>
					<th>Slug</th>
					<th>Name</th>
					<th></th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{lifts.map(
					lift => <LiftItem lift={lift} />
				)}
				{creating &&
					<tr>
						<td className="align-middle"><input type="text" onChange={updateSlug} value={slug} /></td>
						<td className="align-middle"><input type="text" onChange={updateName} value={name} /></td>
						<td className="align-middle">
							<Button onClick={() => createLift({ slug, name })} disabled={!newLiftValid || creatingLift}>
								{creatingLift ? "Saving...": "Save"}
							</Button>
						</td>
						<td className="align-middle">
							<Button variant="danger" onClick={() => setCreating && setCreating(false)}>
								Delete
							</Button>
						</td>
					</tr>
				}
			</tbody>
		</Table>
	</>;
}
