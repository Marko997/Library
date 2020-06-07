import * as Validator from 'class-validator';
export class EditStudentDto{
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(6,128)
    // @Validator.Matches(/^[a-z][a-z0-9\.]{,30}[a-z0-9]$/)
    password: string;

    @Validator.IsNotEmpty()
    @Validator.IsPhoneNumber(null)
    @Validator.Length(5,24)
    phoneNumber: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(1,24)
    classNumber: string;
}