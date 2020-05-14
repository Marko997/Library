import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Book } from "../../../entities/book.entity";

@Injectable()
export class BookService extends TypeOrmCrudService<Book>{
    constructor(
        @InjectRepository(Book)
        private readonly book: Repository<Book>, //evidentiram u app.module
    ){
        super(book);
    }
}