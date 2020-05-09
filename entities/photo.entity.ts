import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Book } from "./book.entity";

@Index("uq_photo_image_path", ["imagePath"], { unique: true })
@Index("fk_photo_book_id", ["bookId"], {})
@Entity("photo")
export class Photo {
  @PrimaryGeneratedColumn({ type: "int", name: "photo_id", unsigned: true })
  photoId: number;

  @Column( { type: "int",name: "book_id", unsigned: true })
  bookId: number;

  @Column( {
    type: "varchar",
    name: "image_path",
    unique: true,
    length: 128,
    
  })
  imagePath: string;

  @ManyToOne(() => Book, (book) => book.photos, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "book_id", referencedColumnName: "bookId" }])
  book: Book;
}
