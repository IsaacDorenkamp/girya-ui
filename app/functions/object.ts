export function exclude(object: { [key: string]: any }, ...keys: string[]) {
	const result: { [key: string]: any } = {};

	for (const key of Object.keys(object)) {
		if (!keys.includes(key)) result[key] = object[key];
	}

	return result;
}
