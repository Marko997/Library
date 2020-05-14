import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Book } from "./book.entity";
import { Librarian } from "./librarian.entity";
import { Student } from "./student.entity";

@Index("fk_loan_student_id", ["studentId"], {})
@Index("fk_loan_librarian_id", ["librarianId"], {})
@Index("fk_loan_book_id", ["bookId"], {})
@Entity("loan")
export class Loan {
  @PrimaryGeneratedColumn({ type: "int", name: "loan_id", unsigned: true })
  loanId: number;

  @Column( {type: "int", name: "student_id", unsigned: true })
  studentId: number;

  @Column( {type: "int", name: "librarian_id", unsigned: true })
  librarianId: number;

  @Column( {
    type: "timestamp",
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column( {
    type: "timestamp",
    name: "expected_to_be_returned_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  expectedToBeReturnedAt: Date;

  @Column( {
    type: "enum",
    name: "status",
    enum: ["pending", "loaned", "returned", "lost"],
    default: () => "'pending'",
  })
  status: "pending" | "loaned" | "returned" | "lost";

  @Column( {
    type: "timestamp",
    name: "returned_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  returnedAt: Date | null;

  @Column( {type: "int", name: "book_id", unsigned: true })
  bookId: number;

  @ManyToOne(() => Book, (book) => book.loans, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "book_id", referencedColumnName: "bookId" }])
  book: Book;

  @ManyToOne(() => Librarian, (librarian) => librarian.loans, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "librarian_id", referencedColumnName: "librarianId" }])
  librarian: Librarian;

  @ManyToOne(() => Student, (student) => student.loans, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "student_id", referencedColumnName: "studentId" }])
  student: Student;
}
