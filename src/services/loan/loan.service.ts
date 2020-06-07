import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Loan } from "../../entities/loan.entity";
import { ApiResponse } from "src/misc/api.response.class";
import { AddLoanDto } from "src/dtos/loan/add.loan.dto";
import { EditLoanDto } from "src/dtos/loan/edit.loan.dto";

@Injectable()
export class LoanService extends TypeOrmCrudService<Loan>{
    constructor(
        @InjectRepository(Loan)
        private readonly loan: Repository<Loan>, //evidentiram u app.module
    ){
        super(loan);
    }

    async createFullLoan(data: AddLoanDto): Promise<Loan | ApiResponse> {
        const newLoan: Loan = new Loan();
        newLoan.studentId                  = data.studentId;
        newLoan.librarianId                = data.librarianId;
        newLoan.createdAt                  = data.createdAt;
        newLoan.expectedToBeReturnedAt     = data.expectedToBeReturnedAt;
        newLoan.status                     = data.status;
        newLoan.returnedAt                 = data.returnedAt;
        newLoan.bookId                     = data.bookId;

        const savedLoan = await this.loan.save(newLoan);
        if (!savedLoan) {
            return new Promise(resolve => resolve(new ApiResponse('error', -2003)));
        }

        

        return this.loan.findOne(savedLoan.loanId, { relations: [ 'student', 'librarian','book' ] });
    }

    async editFullLoan(loanId: number, data: EditLoanDto):Promise<Loan | ApiResponse>{
        const existingLoan: Loan = await this.loan.findOne(loanId);

        if(!existingLoan){
            return new ApiResponse('error', -5001, 'Loan not found!');
        }

        existingLoan.studentId                  = data.studentId;
        existingLoan.librarianId                = data.librarianId;
        existingLoan.createdAt                  = data.createdAt;
        existingLoan.expectedToBeReturnedAt     = data.expectedToBeReturnedAt;
        existingLoan.status                     = data.status;
        existingLoan.returnedAt                 = data.returnedAt;
        existingLoan.bookId                     = data.bookId;

        const savedLoan = await this.loan.save(existingLoan);
        if(!savedLoan){
            return new ApiResponse('error',-5002,'Could not save edited loan data!');
        }

        return this.loan.findOne(savedLoan.loanId, { relations: [ 'student', 'librarian','book' ] });

}
}