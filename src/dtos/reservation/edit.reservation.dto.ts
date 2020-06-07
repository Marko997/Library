import * as Validator from 'class-validator';
import { ReservationStatus } from 'src/types/reservation.status.enum';

export class EditReservationDto{
    studentId: number;
    bookId: number;
    reserved_at: Date;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.IsEnum(ReservationStatus)
    status: 'pending' | 'loaned' | 'rejected';
    
}