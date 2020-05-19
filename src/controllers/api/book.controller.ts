import { Controller, Post, Body } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { BookService } from "../../services/book/book.service";
import { Book } from "../../../entities/book.entity";
import { AddBookDto } from "../../dtos/book/add.book.dto";
import { ApiResponse } from "../../misc/api.response.class";

@Controller('api/book')
@Crud({
    model:{
        type: Book
    },
    params: {
        id:{
            field: 'bookId',
            type: 'number',
            primary: true
        }
    },
    query:{
        join:{
            author:{
                eager: true,
            },
            photos:{
                eager:true
            }
        }
    }
})
export class BookController{ //dodan u app.module
    constructor(public service: BookService){}
    @Post('createFull')
    createFull(@Body() data: AddBookDto): Promise<Book | ApiResponse> {
        return this.service.createFullBook(data);
    
    }
}