export interface Credentials {
	email: string;
	password: string;
}

export interface RegisterInfo {
	email: string;
	first_name: string;
	last_name: string;
	password: string;
}

export interface Lift {
	name: string;
	slug: string;
	id: number;
}

export interface Split {
	name: string;
	slug: string;
	lifts: Lift[],
	id: number;
}

export interface Workout {
	at: string;  // date as string
	slug: string;
	split: Split;
}

export enum WeightUnit {
	lb = "lb", kg = "kg"
}

export interface Set {
	lift: Lift;
	reps: number;
	weight: number;
	weight_unit: WeightUnit;
	id: number;
}

export interface SetInput {
	lift: string;
	reps: number;
	weight: number;
	weight_unit: WeightUnit;
}
