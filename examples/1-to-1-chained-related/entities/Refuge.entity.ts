import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Pet } from "./Pet.entity";

@Entity()
export class Refuge {
	@PrimaryGeneratedColumn("increment")
	id!: string;

	@Column()
	name!: string;

	@OneToOne(
		() => Pet,
		(pet) => pet.refuge,
		{ nullable: false },
	)
	@JoinColumn({ name: "pet_id" })
	pet!: Pet;
}
