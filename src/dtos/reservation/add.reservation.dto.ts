import { ReservationStatus } from "src/types/reservation.status.enum";
import * as Validator from 'class-validator';

export class AddReservationDto{
    studentId: number;
    bookId: number;
    reserved_at: Date;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.IsEnum(ReservationStatus)
    status: 'pending' | 'loaned' | 'rejected';
    
}