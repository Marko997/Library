import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Loan } from "./loan.entity";

@Index("uq_librarian_username", ["username"], { unique: true })
@Entity("librarian")

export class Librarian {
  @PrimaryGeneratedColumn({ type: "int", name: "librarian_id", unsigned: true })
  librarianId: number;

  @Column( {
    type: "varchar",
    unique: true,
    length: 32
    
  })
  username: string;

  @Column( {
    type: "varchar",
    name: "password_hash",
    length: 128
    
  })
  passwordHash: string;

  @OneToMany(() => Loan, (loan) => loan.librarian)
  loans: Loan[];
}
