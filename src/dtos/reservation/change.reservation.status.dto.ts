import * as Validator from "class-validator";
import { ReservationStatus } from "src/types/reservation.status.enum";
export class ChangeReservationStatusDto{
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.IsEnum(ReservationStatus)
    newStatus: "pending" | "loaned" | "rejected";
}