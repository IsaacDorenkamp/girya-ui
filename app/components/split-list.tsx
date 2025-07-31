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
	const [lifts, setLifts] = useState<Lift[]>([]);
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

	const [,allLiftsChanged] = usePreviousValue(allLifts);
	const [,splitLiftsChanged] = usePreviousValue(split.lifts);
	const [,updatingSplitChanged] = usePreviousValue(updatingSplit);
	if (allLiftsChanged && allLifts && (allLifts?.length ?? 0) > 0) {
		setSelectedLift(allLifts[0].slug);
	}
	if (splitLiftsChanged) {
		// occurs when split is reloaded from server
		setLifts(split.lifts);
	}
	if (updatingSplitChanged && editing && !updatingSplit) {
		setEditing(false);
	}

	const showLifts = allLifts?.filter(lift => lifts.findIndex(check => check.slug === lift.slug) === -1);
	const options = showLifts?.length ?
		showLifts?.map(lift => <option key={lift.slug}>{lift.name}</option>)
			: <option disabled selected value="">{loadingAllLifts ? "Loading..." : "No more lifts"}</option>;

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
			<tr>
				<td className="text-end align-middle">Lifts</td>
				<td className="text-start align-middle w-100 px-3">
					<Form.Select value={selectedLift} onChange={(event) => {
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
			</tr>
			{
				lifts.length > 0 ?
					lifts.map(lift => {
						return <tr>
							<td></td>
							<td className="px-3">{lift.name}</td>
							<td>
								<Button variant="danger">
									{/* TODO: implement */}
									Delete
								</Button>
							</td>
						</tr>
					}) : <tr>
						<td></td>
						<td><i>No lifts selected.</i></td>
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
	return splits.length === 0 ? <i>No splits.</i> :
		splits.map((split, index) => <Accordion defaultActiveKey="split" className={index > 0 ? "mt-3" : undefined} key={split.slug}>
		<Accordion.Item eventKey="split">
			<Accordion.Header>{split.name}</Accordion.Header>
			<Accordion.Body>
				<SplitEntry split={split} />
			</Accordion.Body>
		</Accordion.Item>
	</Accordion>);
}
