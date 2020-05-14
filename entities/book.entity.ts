import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Author } from "./author.entity";
import { Category } from "./category.entity";
import { Photo } from "./photo.entity";
import { Reservation } from "./reservation.entity";
import { Loan } from "./loan.entity";

@Index("fk_book_category_id", ["categoryId"], {})
@Index("fk_book_author_id", ["authorId"], {})
@Entity("book")
export class Book {
  @PrimaryGeneratedColumn({ type: "int", name: "book_id", unsigned: true })
  bookId: number;

  @Column( { type: "varchar",length: 128 })
  title: string;

  @Column( {type: "int",name: "category_id", unsigned: true })
  categoryId: number;

  @Column( {type: "int",name: "author_id", unsigned: true, })
  authorId: number;

  @Column( {type: "varchar", length: 255 })
  excerpt: string;

  @Column( {type: "text"})
  description: string;

  @Column( {type: "varchar", length: 13 })
  isbn: string;

  @Column( {
    type: "enum",
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

  @OneToMany(() => Loan, (loan) => loan.book)
  loans: Loan[];

  @OneToMany(() => Photo, (photo) => photo.book)
  photos: Photo[];

  @OneToMany(() => Reservation, (reservation) => reservation.book)
  reservations: Reservation[];
}
