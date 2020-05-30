import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Loan } from "../../entities/loan.entity";

@Injectable()
export class LoanService extends TypeOrmCrudService<Loan>{
    constructor(
        @InjectRepository(Loan)
        private readonly loan: Repository<Loan>, //evidentiram u app.module
    ){
        super(loan);
    }
}