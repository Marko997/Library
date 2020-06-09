import { Controller, Post, Body, Param, UseInterceptors, UploadedFile, Req, Delete, Patch, UseGuards } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { BookService } from "../../services/book/book.service";
import { Book } from "../../entities/book.entity";
import { AddBookDto } from "../../dtos/book/add.book.dto";
import { ApiResponse } from "../../misc/api.response.class";
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from "multer";
import { StorageConfig } from "../../../config/storage.config";
import { PhotoService } from "../../services/photo/photo.service";
import { Photo } from "../../entities/photo.entity";
import * as fileType from 'file-type';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { EditBookDto } from "src/dtos/book/edit.book.dto";
import { RoleCheckedGuard } from "src/misc/role.checked.guard";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { BookSearchDto } from "src/dtos/book/book.search.dto";

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
    },

    routes:{
        only: [
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
    }
})
export class BookController{ //dodan u app.module
    constructor(
        public service: BookService,
        public photoService: PhotoService,
        ){}

    @Post('createFull')
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('librarian')
    createFull(@Body() data: AddBookDto): Promise<Book | ApiResponse> {
        return this.service.createFullBook(data);
    
    }

    @Patch(':id') //http//localhost:3000/api/book/5
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('librarian')
    editFullBook(@Param('id') id: number, @Body() data: EditBookDto){
        return this.service.editFullBook(id,data)
    }

    @Post(':id/uploadPhoto/') // POST http://localhost:3000/api/article/:id/uploadPhoto/
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('librarian')
    @UseInterceptors(
        FileInterceptor('photo',{
            storage: diskStorage({
                destination: StorageConfig.photo.destination,
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
                fieldSize: StorageConfig.photo.maxSize,
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

        await this.createResizedImage(photo,StorageConfig.photo.resize.thumb);
        await this.createResizedImage(photo,StorageConfig.photo.resize.small);

        const newPhoto: Photo = new Photo();
        newPhoto.bookId = bookId;
        newPhoto.imagePath = photo.filename;

        const savedPhoto = await this.photoService.add(newPhoto);
        if(!savedPhoto){
            return new ApiResponse('error', -4001);
        }

        return savedPhoto;

    }

    async createResizedImage(photo, resizeSettings){
        const originalFilePath = photo.path;
        const fileName = photo.filename;

        const destinationFilePath = 
        StorageConfig.photo.destination 
        + resizeSettings.directory
        + fileName;

        await sharp(originalFilePath)
            .resize({
                fit: 'cover',
                width: resizeSettings.width,
                height: resizeSettings.height,
                
            })
            .toFile(destinationFilePath);
    }
    //http://localhost:3000/api/book/1/deletePhoto/30
    @Delete(':bookId/deletePhoto/:photoId')
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('librarian')
        public async deletePhoto(
            @Param('bookId') bookId: number,
            @Param('photoId') photoId: number,)
            {
                const photo = await this.photoService.findOne({
                    bookId: bookId,
                    photoId: photoId
                });

                if(!photo){
                    return new ApiResponse('error',-4004,'Photo not found!');
                }

                fs.unlinkSync(StorageConfig.photo.destination+photo.imagePath);
                fs.unlinkSync(StorageConfig.photo.destination+StorageConfig.photo.resize.thumb.directory+photo.imagePath);
                fs.unlinkSync(StorageConfig.photo.destination+StorageConfig.photo.resize.small.directory+photo.imagePath);
            
                const deleteResult = await this.photoService.deleteById(photoId);

                if(deleteResult.affected ===0){
                    return new ApiResponse('error',-4004,'Photo not found!');
                }

                return new ApiResponse('ok',0,'One photo deleted!');
            }
    
    
    @Post('search') 
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('librarian','student')
    async search(@Body() data: BookSearchDto): Promise<Book[]>{
        return await this.service.search(data);
    }
    
}