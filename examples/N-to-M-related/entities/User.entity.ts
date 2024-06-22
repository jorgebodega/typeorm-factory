import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToMany,
	JoinTable,
} from "typeorm";
import { Pet } from "./Pet.entity";

@Entity()
export class User {
	@PrimaryGeneratedColumn("increment")
	id!: number;

	@CreateDateColumn({ name: "created_at" })
	createdAt!: Date;

	@UpdateDateColumn({ name: "updated_at" })
	updatedAt!: Date;

	@Column()
	name!: string;

	@Column({ name: "last_name" })
	lastName!: string;

	@ManyToMany(
		() => Pet,
		(pet) => pet.owners,
	)
	@JoinTable()
	pets!: Pet[];
}
