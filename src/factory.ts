import type { DataSource, SaveOptions } from "typeorm";
import { EagerInstanceAttribute, LazyInstanceAttribute } from "./instanceAttributes";
import { BaseSubfactory } from "./subfactories";
import type { Constructable, FactorizedAttrs } from "./types";

export abstract class Factory<T extends object> {
	protected abstract entity: Constructable<T>;
	protected abstract dataSource: DataSource;
	protected abstract attrs(): FactorizedAttrs<T>;

	/**
	 * Make a new entity without persisting it
	 */
	async make(overrideParams: Partial<FactorizedAttrs<T>> = {}): Promise<T> {
		const attrs: FactorizedAttrs<T> = { ...this.attrs(), ...overrideParams };

		const entity = await this.makeEntity(attrs, false);

		await this.applyEagerInstanceAttributes(entity, attrs, false);
		await this.applyLazyInstanceAttributes(entity, attrs, false);

		return entity;
	}

	/**
	 * Make many new entities without persisting it
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
		const attrs: FactorizedAttrs<T> = { ...this.attrs(), ...overrideParams };
		const preloadedAttrs = Object.entries(attrs).filter(([, value]) => !(value instanceof LazyInstanceAttribute));

		const entity = await this.makeEntity(Object.fromEntries(preloadedAttrs) as FactorizedAttrs<T>, true);
		await this.applyEagerInstanceAttributes(entity, attrs, true);

		const em = this.getEntityManager();
		const savedEntity = await em.save<T>(entity, saveOptions);

		await this.applyLazyInstanceAttributes(savedEntity, attrs, true);
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

	private async makeEntity(attrs: FactorizedAttrs<T>, shouldPersist: boolean) {
		const entity = new this.entity();

		await Promise.all(
			Object.entries(attrs).map(async ([key, value]) => {
				Object.assign(entity, { [key]: await Factory.resolveValue(value, shouldPersist) });
			}),
		);

		return entity;
	}

	private async applyEagerInstanceAttributes(entity: T, attrs: FactorizedAttrs<T>, shouldPersist: boolean) {
		await Promise.all(
			Object.entries(attrs).map(async ([key, value]) => {
				if (value instanceof EagerInstanceAttribute) {
					const newAttrib = value.resolve(entity);
					Object.assign(entity, { [key]: await Factory.resolveValue(newAttrib, shouldPersist) });
				}
			}),
		);
	}

	private async applyLazyInstanceAttributes(entity: T, attrs: FactorizedAttrs<T>, shouldPersist: boolean) {
		await Promise.all(
			Object.entries(attrs).map(async ([key, value]) => {
				if (value instanceof LazyInstanceAttribute) {
					const newAttrib = value.resolve(entity);
					Object.assign(entity, { [key]: await Factory.resolveValue(newAttrib, shouldPersist) });
				}
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
		if (value instanceof Function) {
			return value();
		}
		return value;
	}
}
