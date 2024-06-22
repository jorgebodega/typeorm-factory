import { faker } from "@faker-js/faker";
import { EagerInstanceAttribute, FactorizedAttrs, Factory, SingleSubfactory } from "../../../src";
import { dataSource } from "../dataSource";
import { Refuge } from "../entities/Refuge.entity";
import { PetFactory } from "./Pet.factory";

export class RefugeFactory extends Factory<Refuge> {
	protected entity = Refuge;
	protected dataSource = dataSource;

	protected attrs(): FactorizedAttrs<Refuge> {
		return {
			name: faker.company.name(),
			pet: new EagerInstanceAttribute((instance) => new SingleSubfactory(PetFactory, { refuge: instance })),
		};
	}
}
