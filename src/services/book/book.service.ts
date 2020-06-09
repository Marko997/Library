import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import { Book } from "../../entities/book.entity";
import { AddBookDto } from "../../dtos/book/add.book.dto";
import { ApiResponse } from "../../misc/api.response.class";
import { EditBookDto } from "src/dtos/book/edit.book.dto";
import { BookSearchDto } from "src/dtos/book/book.search.dto";

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

        return this.book.findOne(savedBook.bookId, { relations: [ 'category', 'author','photos' ] });

    }

    async search(data: BookSearchDto): Promise<Book[]>{
        const builder = await this.book.createQueryBuilder("book");

        builder.where('book.categoryId = :categoryId',{categoryId: data.categoryId});

        if(data.keywords && data.keywords.length>0){
            builder.andWhere('(book.title LIKE :kw OR book.excerpt LIKE :kw OR book.description LIKE :kw OR book.author LIKE :kw OR book.isbn LIKE :kw  OR book.status LIKE :kw)',
            {kw:'%' + data.keywords.trim() + '%'});
        }

        let orderBy = 'book.title';
        let orderDirection: 'ASC'|'DESC';

        if(data.orderBy){
            orderBy = data.orderBy;
        }

        if(data.orderDirection){
            orderDirection = data.orderDirection;
        }

        builder.orderBy(orderBy,orderDirection)

        let page = 0;
        let perPage: 5 | 10 | 15 | 20 = 10;

        if(data.page && typeof data.page === 'number' ){
            page = data.page;
        }

        if(data.itemsPerPage && typeof data.itemsPerPage ==='number'){
            perPage = data.itemsPerPage;
        }

        builder.skip(page * perPage);
        builder.take(perPage);

        let bookIds = await (await builder.getMany()).map(book => book.bookId);

        return await this.book.find({
            where: { bookId: In(bookIds)},
            relations:['category', 'author','photos']
        });
    }
}