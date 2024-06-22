import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { User } from "./User.entity";

@Entity()
export class Pet {
	@PrimaryGeneratedColumn("increment")
	id!: string;

	@Column()
	name!: string;

	@ManyToMany(
		() => User,
		(user) => user.pets,
	)
	owners!: User[];
}
