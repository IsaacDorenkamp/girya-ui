import Accordion from "react-bootstrap/Accordion";

import type { Split } from "../types";

interface SplitListProps {
	splits: Split[];
}

export default function SplitList({ splits }: SplitListProps) {
	return splits.length === 0 ? <i>No splits.</i> :
		splits.map(split => <Accordion defaultActiveKey="split">
		<Accordion.Item eventKey="split">
			<Accordion.Header>{split.name}</Accordion.Header>
			<Accordion.Body>
				{split.slug}
			</Accordion.Body>
		</Accordion.Item>
	</Accordion>);
}
