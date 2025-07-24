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

export default function Splits() {
	const { data: splits, error: splitsError, isPending: loadingSplits } = useSplits();
	const [creating, setCreating] = useState<boolean>(false);
	const [name, setName] = useState<string>("");
	const [slug, setSlug] = useState<string>("");
	const [error, setError] = useState<AxiosError<ErrorResponse> | undefined>();

	const [,splitsErrorChanged] = usePreviousValue(splitsError);
	if (splitsErrorChanged) {
		setError(splitsError ?? undefined);
	}

	return <Container>
		<h1>Splits</h1>
		<hr />
		{error && <Alert variant="danger" onClose={() => setError(undefined)}>
			{error.response?.data.detail ?? "Unknown error"}
		</Alert>}
		{loadingSplits ? <><Loading /><br /></> : splits && <SplitList splits={splits} />}
		<Button variant="success" className="mt-3">
			Create Split
		</Button>
		<Modal show={creating} onHide={() => setCreating(false)}>
			<Modal.Header closeButton>
				Create Split
			</Modal.Header>
			<Modal.Body>
				<Row>
					<Col xs={3}>
						Slug:
					</Col>
					<Col xs={9}>
						<input type="text" value={name} onChange={updateName} />
					</Col>
				</Row>
				<Row>
					<Col xs={3}>
						Name:
					</Col>
					<Col xs={9}>
						<input type="text" value={slug} onChange={updateSlug} />
					</Col>
				</Row>
			</Modal.Body>
		</Modal>
	</Container>;
}
