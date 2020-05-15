import { Controller } from "@nestjs/common";
import { Author } from "../../../entities/author.entity";
import { Crud } from "@nestjsx/crud";
import { AuthorService } from "../../services/author/author.service";

@Controller('api/author')
@Crud({
    model:{
        type: Author
    },
    params: {
        id:{
            field: 'authorId',
            type: 'number',
            primary: true
        }
    },
        query:{
            join:{
                
                
            }
        }
    
})
export class AuthorController{ //dodan u app.module
    constructor(public service: AuthorService){}
}