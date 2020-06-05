import { Controller, Post, Body, Req } from "@nestjs/common";
import { LibrarianService } from "../../services/librarian/librarian.service";
import { LoginLibrarianDto } from "../../dtos/librarian/login.librarian.dto";
import { ApiResponse } from "../../misc/api.response.class";
import * as crypto from 'crypto';
import { LoginInfoDto } from "../../dtos/auth/login.info.dto";
import * as jwt from 'jsonwebtoken';
import { JwtDataDto } from "../../dtos/auth/jwt.data.dto";
import { Request } from "express";
import { jwtSecret } from "../../../config/jwt.secret";
import { StudentService } from "src/services/student/student.service";
import { LoginStudentDto } from "src/dtos/student/login.student.dto";

@Controller('auth')
export class AuthController{
    constructor(public librarianService: LibrarianService,
                public studentService: StudentService){}

    @Post('librarian/login') //http://localhost:3000/auth/librarian/login
    async doLibrarianLogin(@Body() data:LoginLibrarianDto, @Req() req: Request): Promise<LoginInfoDto |ApiResponse>{
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

        const jwtData = new JwtDataDto();
        jwtData.role = "librarian";
        jwtData.id = librarian.librarianId;
        jwtData.username = librarian.username;

        let sada = new Date();
        sada.setDate(sada.getDate()+14);
        const istekTimestamp = sada.getTime()/1000;
        jwtData.exp = istekTimestamp;
        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers["user-agent"];

        let token: string = jwt.sign(jwtData.toPlainObject(),jwtSecret);

        const responseObject = new LoginInfoDto(
            librarian.librarianId,
            librarian.username,
            token
        );
            return new Promise(resolve=> resolve(responseObject));
    }


    @Post('student/login') //http://localhost:3000/auth/student/login
    async doStudentLogin(@Body() data:LoginStudentDto, @Req() req: Request): Promise<LoginInfoDto |ApiResponse>{
        const student = await this.studentService.getByUsername(data.username);
        
        if(!student){
            return new Promise(resolve => resolve(new ApiResponse('error',-3001)))
        }
        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);

        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        if(student.passwordHash !== passwordHashString){
            return new Promise(resolve=> resolve(new ApiResponse('error',-3002)))
        }

        const jwtData = new JwtDataDto();
        jwtData.role = "student";
        jwtData.id = student.studentId;
        jwtData.username = student.username;

        let sada = new Date();
        sada.setDate(sada.getDate()+14);
        const istekTimestamp = sada.getTime()/1000;
        jwtData.exp = istekTimestamp;
        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers["user-agent"];

        let token: string = jwt.sign(jwtData.toPlainObject(),jwtSecret);

        const responseObject = new LoginInfoDto(
            student.studentId,
            student.username,
            token
        );
            return new Promise(resolve=> resolve(responseObject));
    }


}