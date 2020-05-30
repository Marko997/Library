import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Loan } from "./loan.entity";
import { Reservation } from "./reservation.entity";

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
  username: string;

  @Column( {
    type: "varchar",
    name: "password_hash",
    length: 128,
  })
  passwordHash: string;

  @Column( {type: "varchar",  length: 64,  })
  forename: string;

  @Column( {type: "varchar",  length: 64, })
  surename: string;

  @Column({
    type: "varchar",
    name: "phone_number",
    unique: true,
    length: 24,
  })
  phoneNumber: string;

  @Column( {type: "varchar", name: "class_number", length: 24,})
  classNumber: string;

  @OneToMany(() => Loan, (loan) => loan.student)
  loans: Loan[];

  @OneToMany(() => Reservation, (reservation) => reservation.student)
  reservations: Reservation[];
}
