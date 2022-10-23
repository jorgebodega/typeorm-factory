import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, OneToOne } from 'typeorm'
import { Refuge } from './Refuge.entity'
import { User } from './User.entity'

@Entity()
export class Pet {
  @PrimaryGeneratedColumn('increment')
  id!: string

  @Column()
  name!: string

  @OneToOne(() => User, (user) => user.pet, { nullable: false })
  @JoinColumn({ name: 'owner_id' })
  owner!: User

  @OneToOne(() => Refuge, (refuge) => refuge.pet, { nullable: false })
  refuge!: Refuge
}
