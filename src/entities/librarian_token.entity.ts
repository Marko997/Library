import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import * as Validator from "class-validator";

@Entity("librarian_token")
export class LibrarianToken {
  @PrimaryGeneratedColumn({ type: "int", name: "librarian_token_id", unsigned: true })
  librarianTokenId: number;

  @Column( { type: "int",name: "librarian_id", unsigned: true })
  librarianId: number;

  @Column( { type: "timestamp",name: "created_at" })
  createdAt: string;

  @Column( { type: "text" })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  token: string;

  @Column( { type: "datetime",name: "expires_at" })
  expiresAt: string;

  @Column( { type: "tinyint",name: "is_valid", default:1 })
  @Validator.IsNotEmpty()
  @Validator.IsIn([0|1])
  isValid: number;

  

  
}
