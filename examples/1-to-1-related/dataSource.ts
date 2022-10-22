import { DataSource } from 'typeorm'

export const dataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  entities: ['examples/1-to-1-related/**/*.entity.ts'],
})
