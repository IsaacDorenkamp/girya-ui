import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import type { AxiosError } from "axios";

import type { ErrorResponse } from "../types";
import useLifts from "../hooks/use-lifts";
import usePreviousValue from "../hooks/use-previous-value";
import Loading from "../components/loading";
import LiftList from "../components/lift-list";

export default function Lifts() {
	const { data: lifts, isPending: loadingLifts, error: liftsError } = useLifts();
	const [creating, setCreating] = useState<boolean>(false);
	const [error, setError] = useState<AxiosError<ErrorResponse> | undefined>();

	const [,liftsErrorChanged] = usePreviousValue(liftsError);
	if (liftsErrorChanged) {
		setError(liftsError ?? undefined);
	}

	return <Container>
		<h1>Lifts</h1>
		<hr />
		{error && <Alert variant="danger" onClose={() => setError(undefined)} dismissible>
			{error.response?.data.detail ?? "Unknown Error"}
		</Alert>}
		{loadingLifts ? <><Loading /><br /></> :
			lifts && <LiftList lifts={lifts} creating={creating} setCreating={setCreating} />}
		{!creating &&
			<Button onClick={() => setCreating(true)} variant="success" className="mt-3"
				disabled={creating}>
				{creating ? "Creating Lift..." : "Create Lift"}
			</Button>
		}
	</Container>;
}
