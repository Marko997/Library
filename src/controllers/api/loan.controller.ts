import { Controller, UseGuards, Post, Body, Param, Patch } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { LoanService } from "../../services/loan/loan.service";
import { Loan } from "../../entities/loan.entity";
import { RoleCheckedGuard } from "src/misc/role.checked.guard";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { AddLoanDto } from "src/dtos/Loan/add.loan.dto";
import { ApiResponse } from "src/misc/api.response.class";
import { EditLoanDto } from "src/dtos/Loan/edit.loan.dto";

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
                loan:{
                    eager:true
                }
                
            }
        },
        routes:{
            only: [
                "createManyBase",
                "createOneBase",
                "updateOneBase",
                "getManyBase",
                "getOneBase",
                
            ],
            createOneBase:{
                decorators: [
                    UseGuards(RoleCheckedGuard),
                    AllowToRoles('librarian','student'),
                ],
            },
            createManyBase:{
                decorators: [
                    UseGuards(RoleCheckedGuard),
                    AllowToRoles('librarian'),
                ],
            },
            updateOneBase:{
                decorators: [
                    UseGuards(RoleCheckedGuard),
                    AllowToRoles('librarian','student'),
                ],
            },

            getManyBase:{
                decorators: [
                    UseGuards(RoleCheckedGuard),
                    AllowToRoles('librarian','student'),
                ],
            },

            getOneBase:{
                decorators: [
                    UseGuards(RoleCheckedGuard),
                    AllowToRoles('librarian','student'),
                ],
            },
        }
    
})
export class LoanController{ //dodan u app.module
    constructor(
        public service: LoanService,
        
        ){}

    @Post('createFull')// POST http//localhost:3000/api/loan/createFull
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('librarian')
    createFull(@Body() data: AddLoanDto): Promise<Loan | ApiResponse> {
        return this.service.createFullLoan(data);
    
    }

    @Patch(':id') // PATCH http//localhost:3000/api/loan/5
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('librarian')
    editFullLoan(@Param('id') id: number, @Body() data: EditLoanDto){
        return this.service.editFullLoan(id,data)
    }
}