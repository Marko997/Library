// import { Controller, Post, Body, Req, HttpException, HttpStatus } from "@nestjs/common";
// import { LibrarianService } from "../../services/librarian/librarian.service";
// import { LoginLibrarianDto } from "../../dtos/librarian/login.librarian.dto";
// import { ApiResponse } from "../../misc/api.response.class";
// import * as crypto from 'crypto';
// import { LoginInfoDto } from "../../dtos/auth/login.info.dto";
// import * as jwt from 'jsonwebtoken';
// import { JwtDataDto } from "../../dtos/auth/jwt.data.dto";
// import { Request } from "express";
// import { jwtSecret } from "../../../config/jwt.secret";
// import { StudentService } from "src/services/student/student.service";
// import { LoginStudentDto } from "src/dtos/student/login.student.dto";
// import { JwtRefreshDataDto } from "src/dtos/auth/jwt.refresh.dto";
// import { StudentRefreshTokenDto } from "src/dtos/auth/student.refresh.token.dto";

// @Controller('auth')
// export class AuthController{
//     constructor(public librarianService: LibrarianService,
//                 public studentService: StudentService){}

//     @Post('librarian/login') //http://localhost:3000/auth/librarian/login
//     async doLibrarianLogin(@Body() data:LoginLibrarianDto, @Req() req: Request): Promise<LoginInfoDto |ApiResponse>{
//         const librarian = await this.librarianService.getByUsername(data.username);
        
//         if(!librarian){
//             return new Promise(resolve => resolve(new ApiResponse('error',-3001)))
//         }
//         const passwordHash = crypto.createHash('sha512');
//         passwordHash.update(data.password);

//         const passwordHashString = passwordHash.digest('hex').toUpperCase();

//         if(librarian.passwordHash !== passwordHashString){
//             return new Promise(resolve=> resolve(new ApiResponse('error',-3002)))
//         }

//         const jwtData = new JwtDataDto();
//         jwtData.role = "librarian";
//         jwtData.id = librarian.librarianId;
//         jwtData.username = librarian.username;
//         jwtData.exp = this.getDatePlus(60*1);
//         jwtData.ip = req.ip.toString();
//         jwtData.ua = req.headers["user-agent"];

//         let token: string = jwt.sign(jwtData.toPlainObject(),jwtSecret);

//         const responseObject = new LoginInfoDto(
//             librarian.librarianId,
//             librarian.username,
//             token,
//             "",
//             "",
//         );
//             return new Promise(resolve=> resolve(responseObject));
//     }


//     @Post('student/login') //http://localhost:3000/auth/student/login
//     async doStudentLogin(@Body() data:LoginStudentDto, @Req() req: Request): Promise<LoginInfoDto |ApiResponse>{
//         const student = await this.studentService.getByUsername(data.username);
        
//         if(!student){
//             return new Promise(resolve => resolve(new ApiResponse('error',-3001)))
//         }
//         const passwordHash = crypto.createHash('sha512');
//         passwordHash.update(data.password);

//         const passwordHashString = passwordHash.digest('hex').toUpperCase();

//         if(student.passwordHash !== passwordHashString){
//             return new Promise(resolve=> resolve(new ApiResponse('error',-3002)))
//         }

//         const jwtData = new JwtDataDto();
//         jwtData.role = "student";
//         jwtData.id = student.studentId;
//         jwtData.username = student.username;
//         jwtData.exp = this.getDatePlus(60*5);
//         jwtData.ip = req.ip.toString();
//         jwtData.ua = req.headers["user-agent"];

//         let token: string = jwt.sign(jwtData.toPlainObject(),jwtSecret);

//         const jwtRefreshData = new JwtRefreshDataDto();
//         jwtRefreshData.role = jwtData.role;
//         jwtRefreshData.id = jwtData.id;
//         jwtRefreshData.exp = this.getDatePlus(60*60*24*31);
//         jwtRefreshData.ip = jwtData.ip;
//         jwtRefreshData.ua = jwtData.ua;

//         let refreshToken: string = jwt.sign(jwtRefreshData.toPlainObject(),jwtSecret);
        

//         const responseObject = new LoginInfoDto(
//             student.studentId,
//             student.username,
//             token,
//             refreshToken,
//             this.getIsoDate(jwtRefreshData.exp),
//         );

//             await this.studentService.addToken(student.studentId,refreshToken,this.getDatabaseDateFormat(this.getIsoDate(jwtRefreshData.exp)))
            
//             return new Promise(resolve=> resolve(responseObject));
//     }

//     @Post('student/refresh')
//     async studentTokenRefresh(@Req() req: Request, @Body() data: StudentRefreshTokenDto): Promise<LoginInfoDto | ApiResponse>{
//         const studentToken = await this.studentService.getStudentToken(data.token);

//         if(!studentToken){
//             return new ApiResponse("error", -10002, "No such refresh token!");
//         }

//         if(studentToken.isValid ===0) {
//             return new ApiResponse("error",-10003, "The token is not valid anymore!");
        
//         }
//         const sada = new Date();
//         const datumIsteka = new Date(studentToken.expiresAt);

//         if(datumIsteka.getTime() < sada.getTime()){
//             return new ApiResponse("error",-10004, "The token has expired!");
//         }

//         let jwtRefreshData: JwtRefreshDataDto;

//         try{
//             jwtRefreshData = jwt.verify(data.token, jwtSecret);
//         }catch(e){
//             throw new HttpException('Bad token found!', HttpStatus.UNAUTHORIZED);
//         }

//         if(!jwtRefreshData){
//             throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
//         }
        
//         if(jwtRefreshData.ip !== req.ip.toString()){
//             throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
//         }

//         if(jwtRefreshData.ua !== req.headers["user-agent"]){
//             throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
//         }

//         const jwtData = new JwtDataDto();
//         jwtData.role = jwtRefreshData.role;
//         jwtData.id = jwtRefreshData.id;
//         jwtData.username = jwtRefreshData.username;
//         jwtData.exp = this.getDatePlus(60*5);
//         jwtData.ip = jwtRefreshData.ip;
//         jwtData.ua = jwtRefreshData.ua;

//         let token: string = jwt.sign(jwtData.toPlainObject(),jwtSecret);

//         const responseObject = new LoginInfoDto(
//             jwtData.id,
//             jwtData.username,
//             token,
//             data.token, //refresh token
//             this.getIsoDate(jwtRefreshData.exp),
//         );

//         return responseObject;

//     }

//     private getDatePlus(numberOfSeconds: number){
//         return new Date().getTime()/1000 + numberOfSeconds;
//     }

//     private getIsoDate(timestamp: number){
//         const date = new Date();
//         date.setTime(timestamp*1000);
//         return date.toISOString();
//     }

//     private getDatabaseDateFormat(isoformat:string):string{
//         return isoformat.substr(0,19).replace('T',' ');
//     }

// }

import { Controller, Post, Body, Req, Put, HttpStatus, HttpException } from "@nestjs/common";
import { LibrarianService } from "src/services/librarian/librarian.service";
import { LoginLibrarianDto } from "src/dtos/librarian/login.librarian.dto";
import { ApiResponse } from "src/misc/api.response.class";
import * as crypto from 'crypto';
import { LoginInfoDto } from "src/dtos/auth/login.info.dto";
import * as jwt from 'jsonwebtoken';
import { JwtDataDto } from "src/dtos/auth/jwt.data.dto";
import { Request } from "express";
import { jwtSecret } from "config/jwt.secret";

import { StudentService } from "src/services/student/student.service";
import { LoginStudentDto } from "src/dtos/student/login.student.dto";
import { JwtRefreshDataDto } from "src/dtos/auth/jwt.refresh.dto";
import { StudentRefreshTokenDto } from "src/dtos/auth/student.refresh.token.dto";
import { LibrarianRefreshTokenDto } from "src/dtos/auth/librarian.refresh.token.dto";

@Controller('auth')
export class AuthController {
    constructor(
        public librarianService: LibrarianService,
        public studentService: StudentService,
    ) { }

    @Post('librarian/login') // http://localhost:3000/auth/librarian/login/
    async doLibrarianLogin(@Body() data: LoginLibrarianDto, @Req() req: Request): Promise<LoginInfoDto | ApiResponse> {
        const librarian = await this.librarianService.getByUsername(data.username);

        if (!librarian) {
            return new Promise(resolve => resolve(new ApiResponse('error', -3001)));
        }

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        if (librarian.passwordHash !== passwordHashString) {
            return new Promise(resolve => resolve(new ApiResponse('error', -3002)));
        }

        const jwtData = new JwtDataDto();
        jwtData.role = "librarian";
        jwtData.id = librarian.librarianId;
        jwtData.username = librarian.username;

        jwtData.exp = this.getDatePlus(60 * 5);

        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers["user-agent"];

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret);

        const jwtRefreshData = new JwtRefreshDataDto();
        jwtRefreshData.role = jwtData.role;
        jwtRefreshData.id = jwtData.id;
        jwtRefreshData.username = jwtData.username;
        jwtRefreshData.exp = this.getDatePlus(60 * 60 * 24 * 31);
        jwtRefreshData.ip = jwtData.ip;
        jwtRefreshData.ua = jwtData.ua;

        let refreshToken: string = jwt.sign(jwtRefreshData.toPlainObject(), jwtSecret);

        const responseObject = new LoginInfoDto(
            librarian.librarianId,
            librarian.username,
            token,
            refreshToken,
            this.getIsoDate(jwtRefreshData.exp),
        );

        await this.librarianService.addToken(
            librarian.librarianId,
            refreshToken,
            this.getDatabseDateFormat(this.getIsoDate(jwtRefreshData.exp))
        );

        return new Promise(resolve => resolve(responseObject));
    }

    @Post('librarian/refresh') // http://localhost:3000/auth/librarian/refresh/
    async librarianTokenRefresh(@Req() req: Request, @Body() data: LibrarianRefreshTokenDto): Promise<LoginInfoDto | ApiResponse> {
        const librarianToken = await this.librarianService.getLibrarianToken(data.token);

        if (!librarianToken) {
            return new ApiResponse("error", -10002, "No such refresh token!");
        }

        if (librarianToken.isValid === 0) {
            return new ApiResponse("error", -10003, "The token is no longer valid!");
        }

        const sada = new Date();
        const datumIsteka = new Date(librarianToken.expiresAt);

        if (datumIsteka.getTime() < sada.getTime()) {
            return new ApiResponse("error", -10004, "The token has expired!");
        }

        let jwtRefreshData: JwtRefreshDataDto;
        
        try {
            jwtRefreshData = jwt.verify(data.token, jwtSecret);
        } catch (e) {
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }

        if (!jwtRefreshData) {
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }

        if (jwtRefreshData.ip !== req.ip.toString()) {
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }

        if (jwtRefreshData.ua !== req.headers["student-agent"]) {
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }

        const jwtData = new JwtDataDto();
        jwtData.role = jwtRefreshData.role;
        jwtData.id = jwtRefreshData.id;
        jwtData.username = jwtRefreshData.username;
        jwtData.exp = this.getDatePlus(60 * 5);
        jwtData.ip = jwtRefreshData.ip;
        jwtData.ua = jwtRefreshData.ua;

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret);

        const responseObject = new LoginInfoDto(
            jwtData.id,
            jwtData.username,
            token,
            data.token,
            this.getIsoDate(jwtRefreshData.exp),
        );

        return responseObject;
    }

    

    @Post('student/login') // POST http://localhost:3000/auth/student/login/
    async doStudentLogin(@Body() data: LoginStudentDto, @Req() req: Request): Promise<LoginInfoDto | ApiResponse> {
        const student = await this.studentService.getByUsername(data.username);

        if (!student) {
            return new Promise(resolve => resolve(new ApiResponse('error', -3001)));
        }

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        if (student.passwordHash !== passwordHashString) {
            return new Promise(resolve => resolve(new ApiResponse('error', -3002)));
        }

        const jwtData = new JwtDataDto();
        jwtData.role = "student";
        jwtData.id = student.studentId;
        jwtData.username = student.username;
        jwtData.exp = this.getDatePlus(60 * 5);
        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers["user-agent"];

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret);

        const jwtRefreshData = new JwtRefreshDataDto();
        jwtRefreshData.role = jwtData.role;
        jwtRefreshData.id = jwtData.id;
        jwtRefreshData.username = jwtData.username;
        jwtRefreshData.exp = this.getDatePlus(60 * 60 * 24 * 31);
        jwtRefreshData.ip = jwtData.ip;
        jwtRefreshData.ua = jwtData.ua;

        let refreshToken: string = jwt.sign(jwtRefreshData.toPlainObject(), jwtSecret);

        const responseObject = new LoginInfoDto(
            student.studentId,
            student.username,
            token,
            refreshToken,
            this.getIsoDate(jwtRefreshData.exp),
        );

        await this.studentService.addToken(
            student.studentId,
            refreshToken,
            this.getDatabseDateFormat(this.getIsoDate(jwtRefreshData.exp))
        );

        return new Promise(resolve => resolve(responseObject));
    }

    @Post('student/refresh') // http://localhost:3000/auth/student/refresh/
    async studentTokenRefresh(@Req() req: Request, @Body() data: StudentRefreshTokenDto): Promise<LoginInfoDto | ApiResponse> {
        const studentToken = await this.studentService.getStudentToken(data.token);

        if (!studentToken) {
            return new ApiResponse("error", -10002, "No such refresh token!");
        }

        if (studentToken.isValid === 0) {
            return new ApiResponse("error", -10003, "The token is no longer valid!");
        }

        const sada = new Date();
        const datumIsteka = new Date(studentToken.expiresAt);

        if (datumIsteka.getTime() < sada.getTime()) {
            return new ApiResponse("error", -10004, "The token has expired!");
        }

        let jwtRefreshData: JwtRefreshDataDto;
        
        try {
            jwtRefreshData = jwt.verify(data.token, jwtSecret);
        } catch (e) {
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }

        if (!jwtRefreshData) {
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }

        if (jwtRefreshData.ip !== req.ip.toString()) {
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }

        if (jwtRefreshData.ua !== req.headers["student-agent"]) {
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }

        const jwtData = new JwtDataDto();
        jwtData.role = jwtRefreshData.role;
        jwtData.id = jwtRefreshData.id;
        jwtData.username = jwtRefreshData.username;
        jwtData.exp = this.getDatePlus(60 * 5);
        jwtData.ip = jwtRefreshData.ip;
        jwtData.ua = jwtRefreshData.ua;

        let token: string = jwt.sign(jwtData.toPlainObject(), jwtSecret);

        const responseObject = new LoginInfoDto(
            jwtData.id,
            jwtData.username,
            token,
            data.token,
            this.getIsoDate(jwtRefreshData.exp),
        );

        return responseObject;
    }

    private getDatePlus(numberOfSeconds: number): number {
        return new Date().getTime() / 1000 + numberOfSeconds;
    }

    private getIsoDate(timestamp: number): string {
        const date = new Date();
        date.setTime(timestamp * 1000);
        return date.toISOString();
    }

    private getDatabseDateFormat(isoFormat: string): string {
        return isoFormat.substr(0, 19).replace('T', ' ');
    }
}

