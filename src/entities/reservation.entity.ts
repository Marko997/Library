import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Book } from "./book.entity";
import { Student } from "./student.entity";
import * as Validator from 'class-validator';
import { ReservationStatus } from "src/types/reservation.status.enum";

@Index("fk_reservation_student_id", ["studentId"], {})
@Index("fk_reservation_book_id", ["bookId"], {})
@Entity("reservation")
export class Reservation {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "reservation_id",
    unsigned: true,
  })
  reservationId: number;

  @Column( {type: "int", name: "student_id", unsigned: true })
  studentId: number;

  @Column( {type: "int", name: "book_id", unsigned: true })
  bookId: number;

  @Column( {
    type: "enum",
    enum: ["pending", "loaned", "rejected"],
    default: () => "'pending'",
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.IsEnum(ReservationStatus)
  status: "pending" | "loaned" | "rejected";

  @Column("timestamp", {
    name: "reserved_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  reservedAt: Date;

  @ManyToOne(() => Book, (book) => book.reservations, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "book_id", referencedColumnName: "bookId" }])
  book: Book;

  @ManyToOne(() => Student, (student) => student.reservations, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "student_id", referencedColumnName: "studentId" }])
  student: Student;
}
