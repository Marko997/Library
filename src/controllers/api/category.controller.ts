import { Controller } from "@nestjs/common";
import { Category } from "../../entities/category.entity";
import { Crud } from "@nestjsx/crud";
import { CategoryService } from "../../services/category/category.service";

@Controller('api/category')
@Crud({
    model:{
        type: Category
    },
    params: {
        id:{
            field: 'categoryId',
            type: 'number',
            primary: true
        }
    },
        query:{
            join:{
                categories:{
                    eager:false,
                },
                books:{
                    eager:true,
                },
                
            }
        },
        routes:{
            exclude: [
                'updateOneBase',
                'deleteOneBase',
                'replaceOneBase',
            ]
        }
    
})
export class CategoryController{ //dodan u app.module
    constructor(public service: CategoryService){}
}