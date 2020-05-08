import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Librarian {
    @PrimaryGeneratedColumn({ name: 'librarian_id', type: 'int', unsigned: true })
    librarianId: number;

    @Column({type:'varchar', length:'32', unique: true})
    username: string;

    @Column({name:'password_hash', type:'varchar',length:'128'})
    passwordHash: string;
}