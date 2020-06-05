import { Controller, UseGuards } from "@nestjs/common";
import { Author } from "../../entities/author.entity";
import { Crud } from "@nestjsx/crud";
import { AuthorService } from "../../services/author/author.service";
import { RoleCheckedGuard } from "src/misc/role.checked.guard";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";

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
export class AuthorController{ //dodan u app.module
    constructor(public service: AuthorService){}
}