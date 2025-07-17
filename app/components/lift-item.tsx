import { type ChangeEvent, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";

import type { Lift } from "../types";
import useUpdateLift from "../hooks/use-update-lift";
import useDeleteLift from "../hooks/use-delete-lift";
import usePreviousValue from "../hooks/use-previous-value";

interface LiftItemProps {
	lift: Lift;
	setError?: (error?: string) => void;
}

export default function LiftItem({ lift, setError }: LiftItemProps) {
	const [slug, setSlug] = useState<string>(lift.slug);
	const [name, setName] = useState<string>(lift.name);
	const [editing, setEditing] = useState<boolean>(false);
	const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

	const { mutate: updateLift, isPending: updatingLift, error: updateError, isError: isUpdateError,
		isSuccess: isUpdateSuccess, reset: resetUpdate }
		= useUpdateLift();
	const { mutate: deleteLift, isPending: deletingLift, error: deleteError, isError: isDeleteError,
		isSuccess: isDeleteSuccess, reset: resetDelete }
		= useDeleteLift();

	// It is an error to update the parent's state from the child directly
	useEffect(() => {
		const error = (updateError || deleteError)?.response?.data.detail;
		error && setError && setError(error);
	}, [isUpdateError, isDeleteError, updateError, deleteError, setError]);
	useEffect(() => {
		if (isUpdateSuccess || isDeleteSuccess) {
			setEditing(false);
			setError && setError(undefined);
			isUpdateSuccess && resetUpdate();
			isDeleteSuccess && resetDelete();
		}
	}, [isUpdateSuccess, isDeleteSuccess, isUpdateSuccess, isDeleteSuccess, setError]);

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
		<td className="align-middle">{editing ? <input type="text" onChange={updateSlug} value={slug} /> : lift.slug}</td>
		<td className="align-middle">
			{editing ? <input type="text" onChange={updateName} value={name} /> : lift.name}
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
