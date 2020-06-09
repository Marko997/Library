import { ReservationService } from "src/services/reservation/reservation.service";
import { Param, Get, UseGuards, Body, Patch, Controller } from "@nestjs/common";
import { ApiResponse } from "src/misc/api.response.class";
import { RoleCheckedGuard } from "src/misc/role.checked.guard";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { Reservation } from "src/entities/reservation.entity";
import { ChangeReservationStatusDto } from "src/dtos/reservation/change.reservation.status.dto";

@Controller('api/reservation')
export class LibrarianReservationController{
    constructor(
        private reservationService: ReservationService,
    ){}

    @Get(':id') //http://localhost:3000/api/loan/:id
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('librarian')
    async get(@Param('id') id: number): Promise<Reservation | ApiResponse>{

        const reservation = await this.reservationService.getById(id);

        if(!reservation){
            return new ApiResponse("error",-9001, "No such reservation found!")
        }

        return reservation;
    }

    @Patch(':id')//http://localhost:3000/api/loan/:id
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('librarian')
    async changeStatus(@Param('id')id:number, @Body() data: ChangeReservationStatusDto){
        return await this.reservationService.changeStatus(id,data.newStatus);

    }
}