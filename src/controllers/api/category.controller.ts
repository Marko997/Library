import { Controller, UseGuards } from "@nestjs/common";
import { Category } from "../../entities/category.entity";
import { Crud } from "@nestjsx/crud";
import { CategoryService } from "../../services/category/category.service";
import { RoleCheckedGuard } from "src/misc/role.checked.guard";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";

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
            only: [
                "createManyBase",
                "createOneBase",
                "updateOneBase",
                "getManyBase",
                "getOneBase",
                
            ],
            createOneBase:{
                decorators: [
                    UseGuards(RoleCheckedGuard),
                    AllowToRoles('librarian'),
                ],
            },
            createManyBase:{
                decorators: [
                    UseGuards(RoleCheckedGuard),
                    AllowToRoles('librarian'),
                ],
            },
            updateOneBase:{
                decorators: [
                    UseGuards(RoleCheckedGuard),
                    AllowToRoles('librarian'),
                ],
            },

            getManyBase:{
                decorators: [
                    UseGuards(RoleCheckedGuard),
                    AllowToRoles('librarian','student'),
                ],
            },

            getOneBase:{
                decorators: [
                    UseGuards(RoleCheckedGuard),
                    AllowToRoles('librarian','student'),
                ],
            },

            

        }
    
})
export class CategoryController{ //dodan u app.module
    constructor(public service: CategoryService){}
}