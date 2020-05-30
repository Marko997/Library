import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Reservation } from "../../entities/reservation.entity";

@Injectable()
export class ReservationService extends TypeOrmCrudService<Reservation>{
    constructor(
        @InjectRepository(Reservation)
        private readonly reservation: Repository<Reservation>, //evidentiram u app.module
    ){
        super(reservation);
    }
}