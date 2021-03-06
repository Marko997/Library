import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Category } from "../../entities/category.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class CategoryService extends TypeOrmCrudService<Category>{
    constructor(
        @InjectRepository(Category)
        private readonly category: Repository<Category>, //evidentiram u app.module
    ){
        super(category);
    }
}