import { Controller } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { ReservationService } from "../../services/reservation/reservation.service";
import { Reservation } from "../../entities/reservation.entity";

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
            exclude: [
                'updateOneBase',
                'deleteOneBase',
                'replaceOneBase',
            ]
        }
    
})
export class ReservationController{ //dodan u app.module
    constructor(public service: ReservationService){}
}