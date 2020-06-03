import { Controller } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { LoanService } from "../../services/loan/loan.service";
import { Loan } from "../../entities/loan.entity";

@Controller('api/loan')
@Crud({
    model:{
        type: Loan
    },
    params: {
        id:{
            field: 'loanId',
            type: 'number',
            primary: true
        }
    },
        query:{
            join:{
                student:{
                    eager: true,
                },
                librarian:{
                    eager:true
                },
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
export class LoanController{ //dodan u app.module
    constructor(public service: LoanService){}
}