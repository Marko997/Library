import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Reservation } from "../../entities/reservation.entity";
import { AddReservationDto } from "src/dtos/reservation/add.reservation.dto";
import { ApiResponse } from "src/misc/api.response.class";
import { EditReservationDto } from "src/dtos/reservation/edit.reservation.dto";

@Injectable()
export class ReservationService extends TypeOrmCrudService<Reservation>{
    constructor(
        @InjectRepository(Reservation)
        private readonly reservation: Repository<Reservation>, //evidentiram u app.module
    ){
        super(reservation);
    }

    async createFullReservation(data: AddReservationDto): Promise<Reservation | ApiResponse> {
        const newReservation: Reservation = new Reservation();
        newReservation.studentId        = data.studentId;
        newReservation.bookId  = data.bookId;
        newReservation.reservedAt   = data.reserved_at;
        newReservation.status     = data.status;
        

        const savedReservation = await this.reservation.save(newReservation);
        if (!savedReservation) {
            return new Promise(resolve => resolve(new ApiResponse('error', -2003)));
        }

        

        return this.reservation.findOne(savedReservation.reservationId, { relations: [ 'student', 'book', ] });
    }

    async editFullReservation(ReservationId: number, data: EditReservationDto):Promise<Reservation | ApiResponse>{
        const existingReservation: Reservation = await this.reservation.findOne(ReservationId);

        if(!existingReservation){
            return new ApiResponse('error', -5001, 'Reservation not found!');
        }

        existingReservation.studentId = data.studentId;
        existingReservation.bookId = data.bookId;
        existingReservation.reservedAt = data.reserved_at;
        existingReservation.status = data.status;


        const savedReservation = await this.reservation.save(existingReservation);
        if(!savedReservation){
            return new ApiResponse('error',-5002,'Could not save edited reservation data!');
        }

        return this.getById(savedReservation.reservationId);

    }

    async getById(reservationId: number){
        return await this.reservation.findOne(reservationId,{relations: [ 'student', 'book', ]});

        
    }

    async changeStatus(reservationId: number, newStatus: "pending" | "loaned" | "rejected"){
        const reservation = await this.getById(reservationId);

        if(!reservation){
            return new ApiResponse("error",-9001,"No such order found");
            
        }
        reservation.status = newStatus;

        await this.reservation.save(reservation);

        return await this.getById(reservationId);
    }
}