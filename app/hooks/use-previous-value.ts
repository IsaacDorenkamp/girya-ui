import { useState } from "react";

export default function usePreviousValue<T>(value: T) {
	const [current, setCurrent] = useState<T>(value);

	let changed = false;
	if (current !== value) {
		setCurrent(value);
		changed = true;
	}

	return [current, changed];
}
