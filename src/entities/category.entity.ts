import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Book } from "./book.entity";
import * as Validator from "class-validator";

@Index("uq_categorty_name", ["name"], { unique: true })
@Entity("category")
export class Category {
  @PrimaryGeneratedColumn({ type: "int", name: "category_id", unsigned: true })
  categoryId: number;

  @Column({
    type: "varchar",
    name: "name",
    unique: true,
    length: 32,
    
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(5,32)
  name: string;

  @Column( { type: "varchar",name: "image_path", length: 150 })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(1,150)
  imagePath: string;

  @OneToMany(() => Book, (book) => book.category)
  books: Book[];
}
