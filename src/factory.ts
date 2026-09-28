import type { DataSource, SaveOptions } from "typeorm";
import { EagerInstanceAttribute, InstanceAttribute, LazyInstanceAttribute } from "./instanceAttributes";
import { BaseSubfactory } from "./subfactories";
import type { Constructable, FactorizedAttrs } from "./types";

type AttrEntries = [string, unknown][];

export abstract class Factory<T extends object> {
	protected abstract entity: Constructable<T>;
	protected abstract dataSource: DataSource;
	protected abstract attrs(): FactorizedAttrs<T>;

	/**
	 * Make a new entity without persisting it
	 */
	async make(overrideParams: Partial<FactorizedAttrs<T>> = {}): Promise<T> {
		const { plain, eager, lazy } = Factory.partition({ ...this.attrs(), ...overrideParams });

		const entity = new this.entity();
		await Factory.assign(entity, plain, false);
		await Factory.assign(entity, eager, false);
		await Factory.assign(entity, lazy, false);

		return entity;
	}

	/**
	 * Make many new entities without persisting them
	 */
	async makeMany(amount: number, overrideParams: Partial<FactorizedAttrs<T>> = {}): Promise<T[]> {
		const list = [];
		for (let index = 0; index < amount; index++) {
			list[index] = await this.make(overrideParams);
		}
		return list;
	}

	/**
	 * Create a new entity and persist it
	 */
	async create(overrideParams: Partial<FactorizedAttrs<T>> = {}, saveOptions?: SaveOptions): Promise<T> {
		const { plain, eager, lazy } = Factory.partition({ ...this.attrs(), ...overrideParams });

		const entity = new this.entity();
		await Factory.assign(entity, plain, true);
		await Factory.assign(entity, eager, true);

		const em = this.getEntityManager();
		const savedEntity = await em.save<T>(entity, saveOptions);

		if (lazy.length === 0) {
			return savedEntity;
		}

		await Factory.assign(savedEntity, lazy, true);
		return em.save<T>(savedEntity, saveOptions);
	}

	/**
	 * Create many new entities and persist them
	 */
	async createMany(
		amount: number,
		overrideParams: Partial<FactorizedAttrs<T>> = {},
		saveOptions?: SaveOptions,
	): Promise<T[]> {
		const list = [];
		for (let index = 0; index < amount; index++) {
			list[index] = await this.create(overrideParams, saveOptions);
		}
		return list;
	}

	protected getEntityManager() {
		return this.dataSource.createEntityManager();
	}

	private static partition(attrs: object) {
		const plain: AttrEntries = [];
		const eager: AttrEntries = [];
		const lazy: AttrEntries = [];

		for (const entry of Object.entries(attrs)) {
			if (entry[1] instanceof LazyInstanceAttribute) {
				lazy.push(entry);
			} else if (entry[1] instanceof EagerInstanceAttribute) {
				eager.push(entry);
			} else {
				plain.push(entry);
			}
		}

		return { plain, eager, lazy };
	}

	private static async assign(entity: object, entries: AttrEntries, shouldPersist: boolean) {
		await Promise.all(
			entries.map(async ([key, value]) => {
				const attr = value instanceof InstanceAttribute ? await value.resolve(entity) : value;
				Object.assign(entity, { [key]: await Factory.resolveValue(attr, shouldPersist) });
			}),
		);
	}

	private static async resolveValue(value: unknown, shouldPersist: boolean): Promise<unknown> {
		if (value instanceof BaseSubfactory) {
			return shouldPersist ? value.create() : value.make();
		}
		if (Array.isArray(value)) {
			return await Promise.all(value.map((val: unknown) => Factory.resolveValue(val, shouldPersist)));
		}
		if (typeof value === "function") {
			return value();
		}
		return value;
	}
}
