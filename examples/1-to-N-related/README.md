## Two entities with a 1-to-N relationship

This example shows how to create two entities with a 1-to-N relationship. The `User` entity has many `Pet` entities, which are related to the `User` entity.

```typescript
// factories/UserFactory.ts
export class UserFactory extends Factory<User> {
  ...
  protected attrs(): FactorizedAttrs<User> {
    return {
      ...
      pets: [], // or
      pets: new LazyInstanceAttribute((instance) => new CollectionSubfactory(PetFactory, 1, { owner: instance }))
    }
  }
}

// factories/PetFactory.ts
export class PetFactory extends Factory<Pet> {
  ...
  protected attrs(): FactorizedAttrs<Pet> {
    return {
      ...
      owner: new EagerInstanceAttribute((instance) => new SingleSubfactory(UserFactory, { pets: [instance] })),
    }
  }
}
```

The `Pet` entity is the one that has the relation column, so it cannot be created **before** the `User` entity. That's why the `UserFactory` has a `LazyInstanceAttribute` for the `pets` attribute, which will create the `Pet` entities **after** the `User` entity is created.

Also, the `pets` attribute needs to be an array, so we can use here a `CollectionSubfactory`. The behaviour is similar to `SingleSubfactory`, but it creates a collection of entities instead of only one.

Some more examples could be found on both test files.
