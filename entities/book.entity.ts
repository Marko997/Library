import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  OneToOne,
} from "typeorm";
import { Author } from "./author.entity";
import { Category } from "./category.entity";
import { Photo } from "./photo.entity";
import { Reservation } from "./reservation.entity";
import { Loan } from "./loan.entity";

@Index("uq_book_loan_id", ["loanId"], { unique: true })
@Index("fk_book_category_id", ["categoryId"], {})
@Index("fk_book_author_id", ["authorId"], {})
@Entity("book", { schema: "library" })
export class Book {
  @PrimaryGeneratedColumn({ type: "int", name: "book_id", unsigned: true })
  bookId: number;

  @Column("varchar", { name: "title", length: 128, default: () => "'0'" })
  title: string;

  @Column("int", { name: "category_id", unsigned: true, default: () => "'0'" })
  categoryId: number;

  @Column("int", { name: "author_id", unsigned: true, default: () => "'0'" })
  authorId: number;

  @Column("int", {
    name: "loan_id",
    unique: true,
    unsigned: true,
    default: () => "'0'",
  })
  loanId: number;

  @Column("varchar", { name: "excerpt", length: 255, default: () => "'0'" })
  excerpt: string;

  @Column("text", { name: "description" })
  description: string;

  @Column("varchar", { name: "isbn", length: 13, default: () => "'0'" })
  isbn: string;

  @Column("enum", {
    name: "status",
    enum: [
      "rented",
      "lost",
      "destroyed",
      "avaiable",
      "not-avaiable",
      "reserved",
    ],
    default: () => "'avaiable'",
  })
  status:
    | "rented"
    | "lost"
    | "destroyed"
    | "avaiable"
    | "not-avaiable"
    | "reserved";

  @ManyToOne(() => Author, (author) => author.books, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "author_id", referencedColumnName: "authorId" }])
  author: Author;

  @ManyToOne(() => Category, (category) => category.books, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "category_id", referencedColumnName: "categoryId" }])
  category: Category;

  @OneToOne(() => Loan, (loan) => loan.book, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "loan_id", referencedColumnName: "loanId" }])
  loan: Loan;

  @OneToMany(() => Photo, (photo) => photo.book)
  photos: Photo[];

  @OneToMany(() => Reservation, (reservation) => reservation.book)
  reservations: Reservation[];
}
