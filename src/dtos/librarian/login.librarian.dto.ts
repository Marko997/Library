import * as Validator from 'class-validator';
export class LoginLibrarianDto{
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Matches(/^[a-z][a-z0-9\.]{,30}[a-z0-9]$/)
    username: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(6,128)
    // @Validator.Matches(/^[a-z][a-z0-9\.]{,30}[a-z0-9]$/)
    password: string;
}
