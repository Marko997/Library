export class EditBookDto{
    title: string;
    categoryId: number;
    authorId: number;
    excerpt: string;
    description: string;
    isbn: string;
    status: 'rented'|'lost'|'destroyed'|'avaiable'|'not-avaiable'|'reserved';
    
}