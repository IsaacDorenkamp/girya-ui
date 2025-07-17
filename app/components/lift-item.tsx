import { type ChangeEvent, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";

import type { Lift } from "../types";
import useUpdateLift from "../hooks/use-update-lift";
import useDeleteLift from "../hooks/use-delete-lift";

interface LiftItemProps {
	lift: Lift;
}

export default function LiftItem({ lift }: LiftItemProps) {
	const [slug, setSlug] = useState<string>(lift.slug);
	const [name, setName] = useState<string>(lift.name);
	const [editing, setEditing] = useState<boolean>(false);
	const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

	const { mutate: updateLift, isPending: updatingLift } = useUpdateLift();
	const { mutate: deleteLift, isPending: deletingLift } = useDeleteLift();

	const onDeleteClicked = () => {
		if (confirmDelete) {
			deleteLift({ slug: lift.slug });
			setConfirmDelete(false);
		} else {
			setConfirmDelete(true);
		}
	};

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

	useEffect(() => {
		if (confirmDelete) {
			const timeout_id = setTimeout(() => {
				setConfirmDelete(false);
			}, 3000);
			return () => { clearTimeout(timeout_id); };
		}
	}, [confirmDelete]);

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
		<td>
			<Button onClick={onDeleteClicked} variant="danger">
				{deletingLift ? "Deleting..." : (confirmDelete ? "Confirm Delete" : "Delete")}
			</Button>
		</td>
	</tr>;
}
