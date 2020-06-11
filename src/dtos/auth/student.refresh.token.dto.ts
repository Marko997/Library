import * as Validator from 'class-validator';

export class StudentRefreshTokenDto{

    @Validator.IsNotEmpty()
    @Validator.IsString()
    token: string;
}