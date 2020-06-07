import * as Validator from 'class-validator';


export class EditLibrarianDto {
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(6,128)
    password: string;
}