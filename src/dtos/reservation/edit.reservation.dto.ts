export class EditReservationDto{
    studentId: number;
    bookId: number;
    reserved_at: Date;
    status: 'pending' | 'loaned' | 'rejected';
    
}