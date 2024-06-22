import { BaseSubfactory } from "./baseSubfactory";

export class SingleSubfactory<T extends object> extends BaseSubfactory<T> {
	create() {
		return this.factoryInstance.create(this.values);
	}

	make() {
		return this.factoryInstance.make(this.values);
	}
}
