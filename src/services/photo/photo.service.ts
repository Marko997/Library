import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Photo } from "../../../entities/photo.entity";

@Injectable()
export class PhotoService extends TypeOrmCrudService<Photo>{
    constructor(
        @InjectRepository(Photo)
        private readonly photo: Repository<Photo>, //evidentiram u app.module
    ){
        super(photo);
    }
}