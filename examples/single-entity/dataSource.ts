import { DataSource } from 'typeorm'

export const dataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  entities: ['examples/single-entity/**/*.entity.ts'],
})
