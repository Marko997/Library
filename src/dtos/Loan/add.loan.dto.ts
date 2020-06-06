export class AddLoanDto{
    studentId: number;
    librarianId: number;
    createdAt: Date;
    expectedToBeReturnedAt: Date;
    status: 'pending'|'loaned'|'returned'|'lost';
    returnedAt: Date;
    bookId: number;
    
}