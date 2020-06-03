import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Book } from "../../entities/book.entity";
import { AddBookDto } from "../../dtos/book/add.book.dto";
import { ApiResponse } from "../../misc/api.response.class";
import { EditBookDto } from "src/dtos/book/edit.book.dto";

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

    async editFullBook(bookId: number, data: EditBookDto):Promise<Book | ApiResponse>{
        const existingBook: Book = await this.book.findOne(bookId);

        if(!existingBook){
            return new ApiResponse('error', -5001, 'Article not found!');
        }

        existingBook.title = data.title;
        existingBook.categoryId = data.categoryId;
        existingBook.authorId = data.authorId;
        existingBook.excerpt = data.excerpt;
        existingBook.description = data.description;
        existingBook.isbn = data.isbn;
        existingBook.status = data.status;

        const savedBook = await this.book.save(existingBook);
        if(!savedBook){
            return new ApiResponse('error',-5002,'Could not save edited book data!');
        }


    }
}