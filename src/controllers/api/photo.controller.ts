import { Controller, UseGuards } from "@nestjs/common";
import { Photo } from "../../entities/photo.entity";
import { Crud } from "@nestjsx/crud";
import { PhotoService } from "../../services/photo/photo.service";
import { RoleCheckedGuard } from "src/misc/role.checked.guard";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";

@Controller('api/photo')
@Crud({
    model:{
        type: Photo
    },
    params: {
        id:{
            field: 'photoId',
            type: 'number',
            primary: true
        }
    },
        query:{
            join:{
                book:{
                    eager:true
                }
                
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
export class PhotoController{ //dodan u app.module
    constructor(public service: PhotoService){}
}