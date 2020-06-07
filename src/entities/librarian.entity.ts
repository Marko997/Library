import {Column,Entity,Index,OneToMany,PrimaryGeneratedColumn,} from "typeorm";
import { Loan } from "./loan.entity";
import * as Validator from 'class-validator';

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

  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Matches(/^[a-z][a-z0-9\.]{,30}[a-z0-9]$/)
  username: string;

  @Column( {
    type: "varchar",
    name: "password_hash",
    length: 128
    
  })

  @Validator.IsNotEmpty()
  @Validator.IsHash('sha512')
  passwordHash: string;

  @OneToMany(() => Loan, (loan) => loan.librarian)
  loans: Loan[];
}
