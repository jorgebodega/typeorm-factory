## Two entities with a N-to-M relationship

This example shows how to create two entities with a N-to-M relationship. The `User` entity has many `Pet` entities, which are also related to many `User` entities.

```typescript
// factories/UserFactory.ts
export class UserFactory extends Factory<User> {
  ...
  protected attrs(): FactorizedAttrs<User> {
    return {
      ...
      pets: [], // or
      pets: new LazyInstanceAttribute((instance) => new CollectionSubfactory(PetFactory, 1, { owners: [instance] }))
    }
  }
}

// factories/PetFactory.ts
export class PetFactory extends Factory<Pet> {
  ...
  protected attrs(): FactorizedAttrs<Pet> {
    return {
      ...
      owners: [], // or
      owners: new EagerInstanceAttribute((instance) => new CollectionSubfactory(UserFactory, 1, { pets: [instance] })),
    }
  }
}
```

In this case, the relation needs to have a different table to handle the data, so both of the entities need to use `CollectionSubfactory` to create the related entities.

Some more examples could be found on both test files.
