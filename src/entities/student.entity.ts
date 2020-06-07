import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Loan } from "./loan.entity";
import { Reservation } from "./reservation.entity";
import * as Validator from 'class-validator';

@Index("uq_student_username", ["username"], { unique: true })
@Index("uq_student_phone_number", ["phoneNumber"], { unique: true })
@Entity("student")
export class Student {
  @PrimaryGeneratedColumn({ type: "int", name: "student_id", unsigned: true })
  studentId: number;

  @Column( {
    type: "varchar",
    unique: true,
    length: 50,
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Matches(/^[a-z][a-z0-9\.]{,30}[a-z0-9]$/)
  username: string;

  @Column( {
    type: "varchar",
    name: "password_hash",
    length: 128,
  })
  @Validator.IsNotEmpty()
  @Validator.IsHash('sha512')
  passwordHash: string;

  @Column( {type: "varchar",  length: 64,  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(1,64)
  forename: string;

  @Column( {type: "varchar",  length: 64, })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(1,64)
  surename: string;

  @Column({
    type: "varchar",
    name: "phone_number",
    unique: true,
    length: 24,
  })
  @Validator.IsNotEmpty()
  @Validator.IsPhoneNumber(null)
  @Validator.Length(5,24)
  phoneNumber: string;

  @Column( {type: "varchar", name: "class_number", length: 24,})
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(1,24)
  classNumber: string;

  @OneToMany(() => Loan, (loan) => loan.student)
  loans: Loan[];

  @OneToMany(() => Reservation, (reservation) => reservation.student)
  reservations: Reservation[];
}
