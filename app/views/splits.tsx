import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import { Col } from "react-bootstrap";
import type { AxiosError } from "axios";

import type { ErrorResponse } from "../types";
import Loading from "../components/loading";
import SplitList from "../components/split-list"
import usePreviousValue from "../hooks/use-previous-value";
import useSplits from "../hooks/use-splits";
import useCreateSplit from "../hooks/use-create-split";

export default function Splits() {
	const { data: splits, error: splitsError, isPending: loadingSplits } = useSplits();
	const [creating, setCreating] = useState<boolean>(false);
	const [name, setName] = useState<string>("");
	const [slug, setSlug] = useState<string>("");
	const [error, setError] = useState<AxiosError<ErrorResponse> | undefined>();
	const { mutate: createSplit, isPending: creatingSplit, error: createSplitError,
			isSuccess: createdSplit, reset: resetCreate } = useCreateSplit();

	const [,splitsErrorChanged] = usePreviousValue(splitsError);
	const [,createSplitErrorChanged] = usePreviousValue(createSplitError);
	if (splitsErrorChanged) {
		setError(splitsError ?? undefined);
	}
	if (createSplitErrorChanged) {
		setError(createSplitError ?? undefined);
	}

	const updateName = (event: React.ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value);
	};

	const updateSlug = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSlug(event.target.value);
	};

	return <Container>
		<h1>Splits</h1>
		<hr />
		{createdSplit && <Alert variant="success" onClose={() => resetCreate()} dismissible>
			Split created.
		</Alert>}
		{error && <Alert variant="danger" onClose={() => setError(undefined)}>
			{error.response?.data.detail ?? "Unknown error"}
		</Alert>}
		{loadingSplits ? <><Loading /><br /></> : splits && <SplitList splits={splits} />}
		<Button variant="success" className="mt-3" onClick={() => setCreating(true)} disabled={creatingSplit}>
			{creatingSplit ? "Creating..." : "Create Split"}
		</Button>
		<Modal show={creating} onHide={() => setCreating(false)}>
			<Modal.Header closeButton>
				Create Split
			</Modal.Header>
			<Modal.Body>
				<Row>
					<Col xs={3} className="text-end">
						Slug:
					</Col>
					<Col xs={9}>
						<input type="text" value={slug} onChange={updateSlug} />
					</Col>
				</Row>
				<Row className="mt-3">
					<Col xs={3} className="text-end">
						Name:
					</Col>
					<Col xs={9}>
						<input type="text" value={name} onChange={updateName} />
					</Col>
				</Row>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="success" onClick={() => {
					createSplit({
						name,
						slug,
						lifts: [],
					});
					setCreating(false);
				}}>
					Create Split
				</Button>
			</Modal.Footer>
		</Modal>
	</Container>;
}
