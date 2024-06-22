import type { InstanceAttributeCallback } from "../types";

export abstract class InstanceAttribute<T, V> {
	constructor(private callback: InstanceAttributeCallback<T, V>) {}

	resolve(entity: T) {
		return this.callback(entity);
	}
}
