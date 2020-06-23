

import * as Validator from 'class-validator';

export class LibrarianRefreshTokenDto{

    @Validator.IsNotEmpty()
    @Validator.IsString()
    token: string;
}