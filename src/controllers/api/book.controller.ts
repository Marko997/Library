import { Controller, Post, Body, Param, UseInterceptors, UploadedFile, Req } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { BookService } from "../../services/book/book.service";
import { Book } from "../../../entities/book.entity";
import { AddBookDto } from "../../dtos/book/add.book.dto";
import { ApiResponse } from "../../misc/api.response.class";
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from "multer";
import { StorageConfig } from "../../../config/storage.config";
import { PhotoService } from "../../services/photo/photo.service";
import { Photo } from "../../../entities/photo.entity";
import * as fileType from 'file-type';
import * as fs from 'fs';
import * as sharp from 'sharp';

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
    constructor(
        public service: BookService,
        public photoService: PhotoService,
        ){}

    @Post('createFull')
    createFull(@Body() data: AddBookDto): Promise<Book | ApiResponse> {
        return this.service.createFullBook(data);
    
    }

    @Post(':id/uploadPhoto/') // POST http://localhost:3000/api/article/:id/uploadPhoto/
    @UseInterceptors(
        FileInterceptor('photo',{
            storage: diskStorage({
                destination: StorageConfig.photoDestination,
                filename: (req, file, callback) =>{

                    let original: string = file.originalname;

                    let normalized = original.replace(/\s+/g, '-');
                    normalized = normalized.replace(/[^A-z0-9\.\-]/g,'')
                    let sada = new Date();
                    let datePart = '';
                    datePart += sada.getFullYear().toString();
                    datePart += (sada.getMonth()+1).toString();
                    datePart += sada.getDate().toString();

                    
                    let randomPart: string = new Array(10)
                    .fill(0)
                    .map(e=> (Math.random()*9).toFixed(0).toString())
                    .join('');
                    
                    let fileName = datePart + '-' + randomPart +'-'+normalized;

                    callback(null, fileName);
                }
            }),
            fileFilter: (req,file,callback) => {
                //Provera ekstenzije
                if(!file.originalname.toLowerCase().match(/\.(jpg|png)$/)){
                    req.fileFilterError = 'Bad file extension!';
                    callback(null, false);
                    return;
                }

                //Provera tipa sadrzaja
                if(!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))){
                    req.fileFilterError = 'Bad file content!';
                    callback(null,false);
                    return;
                }
                callback(null,true);

            },
            limits: {
                files:1,
                fieldSize: StorageConfig.photoMaxFileSize,
            }

        })
    )
    async uploadPhoto(
        @Param('id') bookId: number, 
        @UploadedFile() photo,
        @Req() req 
        ): Promise<ApiResponse | Photo>{
        if(req.fileFilterError){
            return new ApiResponse('error',-4002, req.fileFilterError);
        }

        if(!photo){
            return new ApiResponse('error',-4002, 'File not uploaded!');
        }

        const fileTypeResult = await fileType.fromFile (photo.path);
        if(!fileTypeResult){
            fs.unlinkSync(photo.path);
            return new ApiResponse ('error',-4002, 'Cannot detect file type!');
        }

        const realMimeType = fileTypeResult.mime;
        if(!(realMimeType.includes('jpeg') ||realMimeType.includes('png'))){
            fs.unlinkSync(photo.path);
            return new ApiResponse ('error',-4002, 'Bad file content type!');
        }

        await this.createThumb(photo);
        await this.createSmallImage(photo);

        const newPhoto: Photo = new Photo();
        newPhoto.bookId = bookId;
        newPhoto.imagePath = photo.filename;

        const savedPhoto = await this.photoService.add(newPhoto);
        if(!savedPhoto){
            return new ApiResponse('error', -4001);
        }

        return savedPhoto;

    }

    async createThumb(photo){
        const originalFilePath = photo.path;
        const fileName = photo.filename;

        const destinationFilePath = StorageConfig.photoDestination + "thumb/"+fileName;

        await sharp(originalFilePath)
            .resize({
                fit: 'cover',
                width: StorageConfig.photoThumbSize.width,
                height: StorageConfig.photoThumbSize.height,
                background: {
                    r: 255, g:255, b:255, aplha:0.0
                }
            })
            .toFile(destinationFilePath);
    }

    async createSmallImage(photo){
        const originalFilePath = photo.path;
        const fileName = photo.filename;

        const destinationFilePath = StorageConfig.photoDestination + "small/"+fileName;

        await sharp(originalFilePath)
            .resize({
                fit: 'cover',
                width: StorageConfig.photoSmallSize.width,
                height: StorageConfig.photoSmallSize.height,
                background: {
                    r: 255, g:255, b:255, aplha:0.0
                }
            })
            .toFile(destinationFilePath);
    
    }
}