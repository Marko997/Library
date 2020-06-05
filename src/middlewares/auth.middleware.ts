import { NestMiddleware, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { LibrarianService } from "../services/librarian/librarian.service";
import * as jwt from 'jsonwebtoken';
import { JwtDataDto } from "../dtos/auth/jwt.data.dto";
import { jwtSecret } from "../../config/jwt.secret";
import { StudentService } from "src/services/student/student.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware{
    constructor(public librarianService: LibrarianService,
                public studentService: StudentService
        ){}
    
    
    async use(req: Request, res: Response, next: NextFunction){
        

        if(!req.headers.authorization){
            throw new HttpException('Token not found',HttpStatus.UNAUTHORIZED);
        }

        const token = req.headers.authorization;

        const tokenParts = token.split(' ');
        if(tokenParts.length !==2){
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);

        }

        const tokenString = tokenParts[1];

        let jwtData: JwtDataDto;

        try{
        jwtData = jwt.verify(tokenString, jwtSecret);
        }catch(e){
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }
        
        if(!jwtData){
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }
        
        if(jwtData.ip !== req.ip.toString()){
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }

        if(jwtData.ua !== req.headers["user-agent"]){
            throw new HttpException('Bad token found', HttpStatus.UNAUTHORIZED);
        }

        if(jwtData.role === "librarian"){
        const librarian = await this.librarianService.getById(jwtData.id);
        if(!librarian){
            throw new HttpException('Account not found', HttpStatus.UNAUTHORIZED);
            
        }
    }else if (jwtData.role ==="student"){
        const student = await this.studentService.getById(jwtData.id);
        if(!student){
            throw new HttpException('Account not found', HttpStatus.UNAUTHORIZED);
            
        }
    }


        const trenutniTimestamp = new Date().getTime()/1000;

        if(trenutniTimestamp >= jwtData.exp){
            throw new HttpException('Token has expired', HttpStatus.UNAUTHORIZED);

        }


        req.token = jwtData;

        next();
    }
}