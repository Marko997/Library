import { NestMiddleware, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { LibrarianService } from "../services/librarian/librarian.service";
import * as jwt from 'jsonwebtoken';
import { JwtDataLibrarianDto } from "../dtos/librarian/jwt.data.librarian.dto";
import { jwtSecret } from "../../config/jwt.secret";

@Injectable()
export class AuthMiddleware implements NestMiddleware{
    constructor(private readonly librarianService: LibrarianService){}
    
    
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

        let jwtData: JwtDataLibrarianDto;

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

        const librarian = await this.librarianService.getById(jwtData.librarianId);
        if(!librarian){
            throw new HttpException('Account not found', HttpStatus.UNAUTHORIZED);
            
        }


        const trenutniTimestamp = new Date().getTime()/1000;

        if(trenutniTimestamp >= jwtData.exp){
            throw new HttpException('Token has expired', HttpStatus.UNAUTHORIZED);

        }

        next();
    }
}