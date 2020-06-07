import * as Validator from 'class-validator';

export class AddBookDto{
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(0,128)
    title: string;


    categoryId: number;
    authorId: number;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(10,255)
    excerpt: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(64,10000)
    description: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(2,13)
    isbn: string;
    
}