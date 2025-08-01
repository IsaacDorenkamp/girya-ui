import { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import type { Split, Lift } from "../types";
import useUpdateSplit from "../hooks/use-update-split";
import useLifts from "../hooks/use-lifts";
import usePreviousValue from "../hooks/use-previous-value";

interface SplitListProps {
	splits: Split[];
}

interface SplitEntryProps {
	split: Split;
}

function SplitEntry({ split }: SplitEntryProps) {
	const [editing, setEditing] = useState<boolean>(false);
	const [slug, setSlug] = useState<string>(split.slug);
	const [name, setName] = useState<string>(split.name);
	const { data: allLifts, isPending: loadingAllLifts } = useLifts();
	const [lifts, setLifts] = useState<Lift[]>(split.lifts);
	const [selectedLift, setSelectedLift] = useState<string | undefined>();

	const updateSlug = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSlug(event.target.value);
	};

	const updateName = (event: React.ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value);
	};

	const { mutate: updateSplit, isPending: updatingSplit } = useUpdateSplit();

	const onEditClicked = () => {
		if (editing) {
			if (!updatingSplit) {
				updateSplit({
					slug: split.slug,
					split: {
						slug,
						name,
						lifts: lifts.map(lift => lift.slug),
					}
				});
			}
		} else {
			setEditing(true);
		}
	};

	const populateSelected = () => {
		const liftSlugs = lifts.map(lift => lift.slug);
		const liftSlug = allLifts?.find(lift => !liftSlugs.includes(lift.slug))?.slug;
		setSelectedLift(liftSlug);
	};
	const updateSelected = () => {
		// check whether we need to shift the selected lift
		const existingLift = split.lifts.find(lift => lift.slug === selectedLift);
		if (existingLift) {
			const liftSlugs = lifts.map(lift => lift.slug);
			const selectedLift = allLifts?.find(lift => !liftSlugs.includes(lift.slug))?.slug;
			setSelectedLift(selectedLift);
		}
	};

	const [,liftsChanged] = usePreviousValue(lifts);
	const [,allLiftsChanged] = usePreviousValue(allLifts);
	const [,splitLiftsChanged] = usePreviousValue(split.lifts);
	const [,updatingSplitChanged] = usePreviousValue(updatingSplit);
	if (
		(allLiftsChanged && allLifts && (allLifts?.length ?? 0) > 0) ||
		(liftsChanged && selectedLift === undefined)
	) {
		if (!selectedLift) populateSelected();
		updateSelected();
	}
	if (splitLiftsChanged) {
		// occurs when split is reloaded from server
		setLifts(split.lifts);
		updateSelected();
	}
	if (updatingSplitChanged && editing && !updatingSplit) {
		setEditing(false);
	}

	const showLifts = allLifts?.filter(lift => lifts.findIndex(check => check.slug === lift.slug) === -1);
	const options = showLifts?.length ?
		showLifts?.map(lift => <option key={lift.slug}>{lift.name}</option>)
			: <option disabled value="">{loadingAllLifts ? "Loading..." : "No more lifts"}</option>;

	return <table className="p-0 w-100">
		<tbody>
			<tr>
				<td className="text-end align-middle">Slug</td>
				<td className="text-start align-middle w-100 px-3" colSpan={2}>
					{editing ? <input value={slug} onChange={updateSlug} /> : split.slug}
				</td>
			</tr>
			<tr>
				<td className="text-end align-middle">Name</td>
				<td className="text-start align-middle w-100 px-3" colSpan={2}>
					{editing ? <input value={name} onChange={updateName} /> : split.name}
				</td>
			</tr>
			{editing ?
				<tr>
					<td className="text-end align-middle">Lifts</td>
					<td className="text-start align-middle w-100 px-3">
						<Form.Select value={selectedLift ?? ""} onChange={(event) => {
							setSelectedLift(event.target.value);
						}}>{options}</Form.Select>
					</td>
					<td>
						<Button variant="success" disabled={!showLifts?.length} onClick={() => {
							const lift = allLifts?.find(lift => lift.slug === selectedLift);
							if (!lift) return;
							const newLifts = [...lifts, lift];
							setLifts(newLifts);
							const nextLift = allLifts?.find(lift => newLifts.findIndex(check => check.slug === lift.slug) === -1);
							setSelectedLift(nextLift?.slug);
						}}>
							Add
						</Button>
					</td>
				</tr> : undefined}
			{
				lifts.length > 0 ?
					lifts.map((lift, index) => {
						return <tr>
							<td className="text-end">{!editing && index === 0 ? "Lifts" : undefined}</td>
							<td className="px-3" colSpan={editing ? 1 : 2}>{lift.name}</td>
							{editing ?
								<td>
									<Button variant="danger" onClick={() => {
										setLifts(lifts.filter(check => check.slug !== lift.slug));
									}}>
										Delete
									</Button>
								</td> : undefined}
						</tr>
					}) : <tr>
						<td className="text-end">{!editing && "Lifts"}</td>
						<td colSpan={2} className="px-3"><i>No lifts selected.</i></td>
					</tr>
			}
			<tr>
				<td colSpan={3} className="text-end">
					<Button onClick={onEditClicked} disabled={updatingSplit}>{editing ? (updatingSplit ? "Saving..." : "Save") : "Edit"}</Button>
				</td>
			</tr>
		</tbody>
	</table>;
}

export default function SplitList({ splits }: SplitListProps) {
	return splits.length === 0 ? <><i>No splits.</i><br /></> :
		splits.map((split, index) => <Accordion defaultActiveKey="split" className={index > 0 ? "mt-3" : undefined} key={split.slug}>
		<Accordion.Item eventKey="split">
			<Accordion.Header>{split.name}</Accordion.Header>
			<Accordion.Body>
				<SplitEntry split={split} />
			</Accordion.Body>
		</Accordion.Item>
	</Accordion>);
}
