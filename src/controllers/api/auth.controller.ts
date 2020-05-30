import { Controller, Post, Body, Req } from "@nestjs/common";
import { LibrarianService } from "../../services/librarian/librarian.service";
import { LoginLibrarianDto } from "../../dtos/librarian/login.librarian.dto";
import { ApiResponse } from "../../misc/api.response.class";
import * as crypto from 'crypto';
import { LoginInfoLibrarianDto } from "../../dtos/librarian/login.info.librarian.dto";
import * as jwt from 'jsonwebtoken';
import { JwtDataLibrarianDto } from "../../dtos/librarian/jwt.data.librarian.dto";
import { Request } from "express";
import { jwtSecret } from "../../../config/jwt.secret";

@Controller('auth')
export class AuthController{
    constructor(public librarianService: LibrarianService){}

    @Post('login') //http://localhost:3000/auth/login
    async doLogin(@Body() data:LoginLibrarianDto, @Req() req: Request): Promise<LoginInfoLibrarianDto |ApiResponse>{
        const librarian = await this.librarianService.getByUsername(data.username);
        
        if(!librarian){
            return new Promise(resolve => resolve(new ApiResponse('error',-3001)))
        }
        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);

        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        if(librarian.passwordHash !== passwordHashString){
            return new Promise(resolve=> resolve(new ApiResponse('error',-3002)))
        }

        const jwtData = new JwtDataLibrarianDto();
        jwtData.librarianId = librarian.librarianId;
        jwtData.username = librarian.username;

        let sada = new Date();
        sada.setDate(sada.getDate()+14);
        const istekTimestamp = sada.getTime()/1000;
        jwtData.exp = istekTimestamp;
        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers["user-agent"];

        let token: string = jwt.sign(jwtData.toPlainObject(),jwtSecret);

        const responseObject = new LoginInfoLibrarianDto(
            librarian.librarianId,
            librarian.username,
            token
        );
            return new Promise(resolve=> resolve(responseObject));
    }

}