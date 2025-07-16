import { useState } from "react";
import Button from "react-bootstrap/Button";

import useLifts from "../hooks/use-lifts";
import Loading from "../components/loading";
import LiftList from "../components/lift-list";

export default function Lifts() {
	const { data: lifts, isPending: loadingLifts } = useLifts();
	const [creating, setCreating] = useState<boolean>(false);

	return <div>
		<h1>Lifts</h1>
		<hr />
		{loadingLifts ? <><Loading /><br /></> :
			<LiftList lifts={lifts} creating={creating} setCreating={setCreating} />}
		{!creating &&
			<Button onClick={() => setCreating(true)} className="mt-3">
				Create Lift
			</Button>
		}
	</div>;
}
