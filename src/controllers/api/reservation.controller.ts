import { Controller, UseGuards, Post, Body, Patch, Param } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { ReservationService } from "../../services/reservation/reservation.service";
import { Reservation } from "../../entities/reservation.entity";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { RoleCheckedGuard } from "src/misc/role.checked.guard";
import { BookService } from "src/services/book/book.service";
import { StudentService } from "src/services/student/student.service";
import { AddReservationDto } from "src/dtos/reservation/add.reservation.dto";
import { ApiResponse } from "src/misc/api.response.class";
import { EditReservationDto } from "src/dtos/reservation/edit.reservation.dto";

@Controller('api/reservation')
@Crud({
    model:{
        type: Reservation
    },
    params: {
        id:{
            field: 'reservationId',
            type: 'number',
            primary: true
        }
    },
        query:{
            join:{
                student:{
                    eager: true,
                },
                book:{
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
export class ReservationController{ //dodan u app.module
    constructor(
        public service: ReservationService,
        public bookService: BookService,
        public studentService: StudentService,
        
        ){}

        @Post('createFull')  // POST http//localhost:3000/api/reservation/
        @UseGuards(RoleCheckedGuard)
        @AllowToRoles('librarian','student')
            createFull(@Body() data: AddReservationDto): Promise<Reservation | ApiResponse> {
        return this.service.createFullReservation(data);
    
    }

    @Patch(':id') // PATCH http//localhost:3000/api/reservation/5
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('librarian','student')
    editFullBook(@Param('id') id: number, @Body() data: EditReservationDto){
        return this.service.editFullReservation(id,data)
    }
}