## Three entities with a 1-to-1 relationship

This example shows how to create three entities with a 1-to-1 relationship. The `User` entity has a `Pet` entity, which is also related to `Refuge`.

```typescript
// factories/UserFactory.ts
export class UserFactory extends Factory<User> {
  ...
  protected attrs(): FactorizedAttrs<User> {
    return {
      ...
      pet: new LazyInstanceAttribute((instance) => new SingleSubfactory(PetFactory, { owner: instance })),
    }
  }
}

// factories/PetFactory.ts
export class PetFactory extends Factory<Pet> {
  ...
  protected attrs(): FactorizedAttrs<Pet> {
    return {
      ...
      owner: new EagerInstanceAttribute((instance) => new SingleSubfactory(UserFactory, { pet: instance })),
      refuge: new LazyInstanceAttribute((instance) => new SingleSubfactory(RefugeFactory, { pet: instance })),
    }
  }
}

// factories/RefugeFactory.ts
export class RefugeFactory extends Factory<Refuge> {
  ...
  protected attrs(): FactorizedAttrs<Refuge> {
    return {
      ...
      pet: new EagerInstanceAttribute((instance) => new SingleSubfactory(PetFactory, { refuge: instance })),
    }
  }
}
```

The `Pet` and `Refuge` entities are the ones that have the relation column, so cannot be created **before** the `User` entity. That's why the `UserFactory` has a `LazyInstanceAttribute` for the `pet` attribute, which will create the `Pet` entity **after** the `User` entity is created. Similar workflow for the `Refuge` entity, that needs to be created **after** the `Pet`. Some more examples could be found on both test files.
