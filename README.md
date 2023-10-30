<h1 align="center" style="text-align: center;">TypeORM Factory</h1>

<p align="center">
  <img alt="NPM" src="https://img.shields.io/npm/l/@jorgebodega/typeorm-factory?style=for-the-badge">
  <a href='https://coveralls.io/github/jorgebodega/typeorm-factory'>
    <img alt="Coveralls main branch" src="https://img.shields.io/coveralls/github/jorgebodega/typeorm-factory/main?style=for-the-badge">
  </a>
</p>

<p align="center">
  <b>A delightful way to use factories in your code.</b></br>
  <span>Inspired by  <a href="https://factoryboy.readthedocs.io/en/stable/">Factory Boy</a> in Python, <a href="https://mikro-orm.io/docs/5.0/seeding#entity-factories">MikroORM seeding</a>  and the repositories from <a href="https://github.com/pleerock">pleerock</a></span></br>
</p>

<p align="center">
  <sub>Made with ❤️ by <a href="https://github.com/jorgebodega">Jorge Bodega</a> and <a href="https://github.com/jorgebodega/typeorm-factory/graphs/contributors">contributors</a></sub>
</p>

<br />

# Contents

- [Installation](#installation)
- [Introduction](#introduction)
- [Factory](#factory-1)
  - [`make` & `makeMany`](#make--makemany)
  - [`create` & `createMany`](#create--createmany)
  - [`attrs`](#attrs)
    - [Simple value](#simple-value)
    - [Function](#function)
    - [InstanceAttribute](#instanceattribute)
    - [Subfactory](#subfactory)
- [Examples](#examples)
  - [Single entity](examples/single-entity/README.md)
  - [1-to-1 related](examples/1-to-1-related/README.md)
  - [1-to-1 nullable related](examples/1-to-1-nullable-related/README.md)
  - [1-to-1 chained related](examples/1-to-1-chained-related/README.md)
  - [1-to-N related](examples/1-to-N-related/README.md)
  - [N-to-M related](examples/N-to-M-related/README.md)

# Installation

Before using this TypeORM extension please read the [TypeORM Getting Started](https://typeorm.io/#/) documentation. This explains how to setup a TypeORM project.

After that, install the extension. Add development flag if you are not using factories in production code.

```bash
npm i [-D] @jorgebodega/typeorm-factory
yarn add [-D] @jorgebodega/typeorm-factory
pnpm add [-D] @jorgebodega/typeorm-factory
```

# Introduction

Isn't it exhausting to create some sample data for your database, well this time is over!

How does it work? Just create a entity factory.

### Entity

```ts
@Entity()
export class Pet {
  @PrimaryGeneratedColumn('increment')
  id!: string

  @Column()
  name!: string

  @ManyToOne(() => User, (user) => user.pets)
  @JoinColumn({ name: 'owner_id' })
  owner!: User
}
```

### Factory

```ts
export class PetFactory extends Factory<Pet> {
  protected entity = Pet
  protected dataSource = dataSource
  protected attrs(): FactorizedAttrs<Pet> {
    return {
      name: faker.animal.insect(),
      owner: new LazyInstanceAttribute((instance) => new SingleSubfactory(UserFactory, { pets: [instance] })),
    }
  }
}
```

# Factory

Factory is how we provide a way to simplify entities creation, implementing a [factory creational pattern](https://refactoring.guru/design-patterns/factory-method). It is defined as an abstract class with generic typing, so you have to extend over it.

```ts
class UserFactory extends Factory<User> {
  protected entity = User
  protected dataSource = dataSource // Imported datasource
  protected attrs(): FactorizedAttrs<User> = {
    ...
  }
}
```

## `make` & `makeMany`

Make and makeMany executes the factory functions and return a new instance of the given entity. The instance is filled with the generated values from the factory function, but not saved in the database.

- **overrideParams** - Override some of the attributes of the entity.

```ts
make(overrideParams: Partial<FactorizedAttrs<T>> = {}): Promise<T>
makeMany(amount: number, overrideParams: Partial<FactorizedAttrs<T>> = {}): Promise<T[]>
```

```ts
new UserFactory().make()
new UserFactory().makeMany(10)

// override the email
new UserFactory().make({ email: 'other@mail.com' })
new UserFactory().makeMany(10, { email: 'other@mail.com' })
```

## `create` & `createMany`

the create and createMany method is similar to the make and makeMany method, but at the end the created entity instance gets persisted in the database using TypeORM entity manager.

- **overrideParams** - Override some of the attributes of the entity.
- **saveOptions** - [Save options](https://github.com/typeorm/typeorm/blob/master/src/repository/SaveOptions.ts) from TypeORM

```ts
create(overrideParams: Partial<FactorizedAttrs<T>> = {}, saveOptions?: SaveOptions): Promise<T>
createMany(amount: number, overrideParams: Partial<FactorizedAttrs<T>> = {}, saveOptions?: SaveOptions): Promise<T[]>
```

```ts
new UserFactory().create()
new UserFactory().createMany(10)

// override the email
new UserFactory().create({ email: 'other@mail.com' })
new UserFactory().createMany(10, { email: 'other@mail.com' })

// using save options
new UserFactory().create({ email: 'other@mail.com' }, { listeners: false })
new UserFactory().createMany(10, { email: 'other@mail.com' }, { listeners: false })
```

## `attrs`

Attributes objects are superset from the original entity attributes.

```ts
protected attrs: FactorizedAttrs<User> = {
  name: faker.person.firstName(),
  lastName: async () => faker.person.lastName(),
  email: new InstanceAttribute((instance) =>
    [instance.name.toLowerCase(), instance.lastName.toLowerCase(), '@email.com'].join(''),
  ),
  country: new Subfactory(CountryFactory),
}
```

Those factorized attributes resolves to the value of the original attribute, and could be one of the following types:

- [Simple value](#simple-value)
- [Function](#function)
- [InstanceAttribute](#instanceattribute)
- [Subfactory](#subfactory)

### Simple value

Nothing special, just a value with same type.

```ts
protected attrs(): FactorizedAttrs<User> = {
  return {
    name: faker.person.firstName(),
  }
}
```

### Function

Function that could be sync or async, and return a value of the same type.

```ts
protected attrs: FactorizedAttrs<User> = {
  return {
    lastName: async () => faker.person.lastName(),
  }
}
```

### InstanceAttribute

Class with a function that receive the current instance and returns a value of the same type. It is ideal for attributes that could depend on some others to be computed.

```ts
protected attrs: FactorizedAttrs<User> = {
  return {
    ...,
    email: new EagerInstanceAttribute((instance) =>
      [instance.name.toLowerCase(), instance.lastName.toLowerCase(), '@email.com'].join(''),
    ),
  }
}
```

In this simple case, if `name` or `lastName` override the value in any way, the `email` attribute will be affected too.

There are two types of `InstanceAttribute`:

- `EagerInstanceAttribute`: Executed after creation of the entity and before persisting it, so database id will be undefined.
- `LazyInstanceAttribute`: Executed after creation of the entity and after persisting it.

Just remember that, if you use `make` or `makeMany`, the only difference between `EagerInstanceAttribute` and `LazyInstanceAttribute` is that `LazyInstanceAttribute` will be processed the last.

### Subfactory

Subfactories are just a wrapper of another factory. This could help to avoid explicit operations that could lead to unexpected results over that factory, like

```ts
protected attrs: FactorizedAttrs<User> = {
  country: async () => new CountryFactory().create({
    name: faker.address.country(),
  }),
}
```

instead of the same with

```ts
protected attrs: FactorizedAttrs<User> = {
  country: new SingleSubfactory(CountryFactory, {
    name: faker.address.country(),
  }),
}
```

Subfactories could be created in two ways, allowing you to specify only the class or passing the instance already created. This could be useful if you have some specific class-related code in your factories:

```ts
protected attrs: FactorizedAttrs<User> = {
  country: new SingleSubfactory(CountryFactory, {
    name: faker.address.country(),
  }),
  // or
  country: new SingleSubfactory(new CountryFactory(), {
    name: faker.address.country(),
  }),
}
```

Subfactory just execute the same kind of operation (`make` or `create`) over the factory. There are two types of `Subfactory`:

- `SingleSubfactory`: Execute `make` or `create` to return a single element.
- `CollectionSubfactory`: Execute `makeMany` or `createMany` to return an array of elements.

A `CollectionSubfactory` is equivalent now to an array of `SingleSubfactory`, so this two statements produce the same result.

```ts
protected attrs: FactorizedAttrs<User> = {
  pets: new CollectionSubfactory(PetFactory, 2, ...)
  // or
  pets: [
    new SingleSubfactory(PetFactory, ...),
    new SingleSubfactory(PetFactory, ...),
  ],
}
```

# Examples

Some basic examples of how to use the library could be found on the `examples`  folder.

- [Single entity](examples/single-entity/README.md)
- [1-to-1 related](examples/1-to-1-related/README.md)
- [1-to-1 nullable related](examples/1-to-1-nullable-related/README.md)
- [1-to-1 chained related](examples/1-to-1-chained-related/README.md)
- [1-to-N related](examples/1-to-N-related/README.md)
- [N-to-M related](examples/N-to-M-related/README.md)