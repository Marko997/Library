import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "./book.entity";

@Entity("author")
export class Author {
  @PrimaryGeneratedColumn({ type: "int", name: "author_id", unsigned: true })
  authorId: number;

  @Column( { type: "varchar", length: 32 })
  forename: string;

  @Column( { type: "varchar", length: 32})
  surename: string;

  @OneToMany(() => Book, (book) => book.author)
  books: Book[];
}
