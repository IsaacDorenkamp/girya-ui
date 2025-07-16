import { type ChangeEvent, useState } from "react";
import Button from "react-bootstrap/Button";

import type { Lift } from "../types";
import useUpdateLift from "../hooks/use-update-lift";

interface LiftItemProps {
	lift: Lift;
}

export default function LiftItem({ lift }: LiftItemProps) {
	const [slug, setSlug] = useState<string>(lift.slug);
	const [name, setName] = useState<string>(lift.name);
	const [editing, setEditing] = useState<boolean>(false);

	const { mutate: updateLift, isPending: updatingLift } = useUpdateLift();

	const updateSlug = (event: ChangeEvent<HTMLInputElement>) => {
		setSlug(event.target.value);
	};

	const updateName = (event: ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value);
	};

	const valid = !!(slug && name);
	const toggleEditing = () => {
		if (editing) {
			if (valid) {
				updateLift({
					slug: lift.slug,
					lift: { slug, name }
				});
			}
		} else {
			setEditing(true);
		}
	};

	return <tr>
		<td className="align-middle">{editing ? <input type="text" onChange={updateSlug} /> : lift.slug}</td>
		<td className="align-middle">
			{editing ? <input type="text" onChange={updateName} /> : lift.name}
		</td>
		<td className="align-middle">
			<Button onClick={toggleEditing} disabled={editing && !valid}>
				{updatingLift ? "Saving..." : (editing ? "Save" : "Edit")}
			</Button>
		</td>
	</tr>;
}
