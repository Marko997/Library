import { Controller } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { BookService } from "../../services/book/book.service";
import { Book } from "../../../entities/book.entity";

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
}