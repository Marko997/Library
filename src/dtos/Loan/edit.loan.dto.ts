import * as Validator from "class-validator";
import { LoanStatus } from "src/types/loan.status.enum";

export class EditLoanDto{
    studentId: number;
    librarianId: number;
    createdAt: Date;
    expectedToBeReturnedAt: Date;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.IsEnum(LoanStatus)
    status: 'pending'|'loaned'|'returned'|'lost';
    returnedAt: Date;
    bookId: number;
    
}