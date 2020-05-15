import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Author } from "../../../entities/author.entity";

@Injectable()
export class AuthorService extends TypeOrmCrudService<Author>{
    constructor(
        @InjectRepository(Author)
        private readonly author: Repository<Author>, //evidentiram u app.module
    ){
        super(author);
    }
}