import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Book } from "../../../entities/book.entity";
import { AddBookDto } from "../../dtos/book/add.book.dto";
import { ApiResponse } from "../../misc/api.response.class";

@Injectable()
export class BookService extends TypeOrmCrudService<Book>{
    constructor(
        @InjectRepository(Book)
        private readonly book: Repository<Book>, //evidentiram u app.module
    ){
        super(book);
    }

    async createFullBook(data: AddBookDto): Promise<Book | ApiResponse> {
        const newBook: Book = new Book();
        newBook.title        = data.title;
        newBook.categoryId  = data.categoryId;
        newBook.authorId   = data.authorId;
        newBook.excerpt     = data.excerpt;
        newBook.description = data.description;

        const savedBook = await this.book.save(newBook);
        if (!savedBook) {
            return new Promise(resolve => resolve(new ApiResponse('error', -2003)));
        }

        

        return this.book.findOne(savedBook.bookId, { relations: [ 'category', 'author', ] });
    }
}