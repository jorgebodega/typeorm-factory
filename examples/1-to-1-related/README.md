## Two entities with a 1-to-1 relationship

This example shows how to create two entities with a 1-to-1 relationship. The `User` entity has a `Profile` entity, which is related to the `User` entity.

The important part of this example is how both factories handle the relationship.

```typescript
// src/factories/UserFactory.ts
export class UserFactory extends Factory<User> {
  ...
  protected attrs(): FactorizedAttrs<User> {
    return {
      ...
      pet: new LazyInstanceAttribute((instance) => new SingleSubfactory(PetFactory, { owner: instance })),
    }
  }
}

// src/factories/PetFactory.ts
export class PetFactory extends Factory<Pet> {
  ...
  protected attrs(): FactorizedAttrs<Pet> {
    return {
      ...
      owner: new EagerInstanceAttribute((instance) => new SingleSubfactory(UserFactory, { pet: instance })),
    }
  }
}
```

The `Pet` entity is the one that has the relation column, so it cannot be created **before** the `User` entity. That's why the `UserFactory` has a `LazyInstanceAttribute` for the `pet` attribute, which will create the `Pet` entity **after** the `User` entity is created. Some more examples could be found on both test files.
