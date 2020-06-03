import { Controller } from "@nestjs/common";
import { Photo } from "../../entities/photo.entity";
import { Crud } from "@nestjsx/crud";
import { PhotoService } from "../../services/photo/photo.service";

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
            exclude: [
                'updateOneBase',
                'deleteOneBase',
                'replaceOneBase',
            ]
        }
    
})
export class PhotoController{ //dodan u app.module
    constructor(public service: PhotoService){}
}