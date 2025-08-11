import { useMemo, useCallback } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import { Col } from "react-bootstrap";

import AuthProvider from "../providers/auth-provider";
import useScopes from "../hooks/use-scopes";

export default function Layout() {
	return <AuthProvider>
		<LayoutMain />
	</AuthProvider>;
}

function LayoutMain() {
	const location = useLocation();
	const navigate = useNavigate();

	const navKey = useMemo(() => {
		return location.pathname.substring(1);
	}, [location]);

	const scopes = useScopes();
	const hasScope = useCallback((scope: string) => scopes.includes(scope), [scopes]);

	return <div className="px-3 py-3">
		<Row>
			<Col xs={3}>
				<Tab.Container activeKey={navKey} onSelect={(key) => navigate(`/${key}`)}>
					<Nav variant="pills" className="flex-column">
						<Nav.Item>
							<Nav.Link eventKey="dashboard">Dashboard</Nav.Link>
						</Nav.Item>
						{hasScope("read:workout") &&
							<Nav.Item>
								<Nav.Link eventKey="workouts">Workouts</Nav.Link>
							</Nav.Item>}
						{hasScope("write:lift") && <Nav.Item>
							<Nav.Link eventKey="lifts">Lifts</Nav.Link>
						</Nav.Item>}
						{hasScope("write:split") && <Nav.Item>
							<Nav.Link eventKey="splits">Splits</Nav.Link>
						</Nav.Item>}
					</Nav>
				</Tab.Container>
			</Col>
			<Col xs={9}>
				<Outlet />
			</Col>
		</Row>
	</div>;
}
