import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm'
import { User } from './User.entity'

@Entity()
export class Pet {
  @PrimaryGeneratedColumn('increment')
  id!: string

  @Column()
  name!: string

  @OneToOne(() => User, (user) => user.pet)
  @JoinColumn({ name: 'owner_id' })
  owner!: User
}
