import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, OneToOne } from "typeorm";
import { Librarian } from "./librarian.entity";
import { Student } from "./student.entity";
import { Book } from "./book.entity";

@Index("fk_loan_student_id", ["studentId"], {})
@Index("fk_loan_librarian_id", ["librarianId"], {})
@Entity("loan")
export class Loan {
  @PrimaryGeneratedColumn({ type: "int", name: "loan_id", unsigned: true })
  loanId: number;

  @Column( {type: "int", name: "student_id", unsigned: true })
  studentId: number;

  @Column("int", { name: "librarian_id", unsigned: true })
  librarianId: number;

  @Column("timestamp", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("timestamp", {
    name: "expected_to_be_returned_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  expectedToBeReturnedAt: Date;

  @Column( {
    type: "enum",
    enum: ["pending", "loaned", "returned", "lost"],
    default: () => "'pending'",
  })
  status: "pending" | "loaned" | "returned" | "lost";

  @Column("timestamp", {
    name: "returned_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  returnedAt: Date | null;

  @OneToOne(() => Book, (book) => book.loan)
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
