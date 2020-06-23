import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Librarian } from '../../entities/librarian.entity';
import { Repository } from 'typeorm';
import { AddLibrarianDto } from '../../dtos/librarian/add.librarian.dto';
import { EditLibrarianDto } from '../../dtos/librarian/edit.librarian.dto';
import * as crypto from 'crypto';
import { ApiResponse } from '../../misc/api.response.class';
import { LibrarianToken } from 'src/entities/librarian_token.entity';


@Injectable()
export class LibrarianService {
    constructor(
        @InjectRepository(Librarian) private readonly librarian: Repository<Librarian>,
        @InjectRepository(LibrarianToken) private readonly librarianToken: Repository<LibrarianToken> 
    ){}

    getAll(): Promise<Librarian[]>{
        return this.librarian.find();
    }
    async getByUsername (usernameS: string):Promise<Librarian | null>{
        const librarian = await this.librarian.findOne({
            username: usernameS
        });
        if(librarian){
            return librarian;
        }
    }

    getById(id: number): Promise<Librarian>{
        return this.librarian.findOne(id);
    }

    add(data: AddLibrarianDto ): Promise<Librarian | ApiResponse>{
        

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);

        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        const newLibrarian: Librarian = new Librarian();
        newLibrarian.username = data.username;
        newLibrarian.passwordHash = passwordHashString;

        return new Promise((resolve)=>{
            this.librarian.save(newLibrarian)
            .then(data => resolve (data))
            .catch(error => {
                const response: ApiResponse = new ApiResponse("error",-1001);
                resolve(response);
            })
        });
        
    }

    async editById(id: number, data: EditLibrarianDto):Promise<Librarian | ApiResponse>{
        let oldLibrarian = await this.librarian.findOne(id);

        if(oldLibrarian === undefined){
            return new Promise ((resolve)=>{
                resolve(new ApiResponse("error", -1002));
            }
            )
        }

        

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);

        const passwordHashString = passwordHash.digest('hex').toUpperCase();


        oldLibrarian.passwordHash = passwordHashString;

        return this.librarian.save(oldLibrarian);
    }

    async addToken(librarianId: number, token: string, expiresAt: string){
        const librarianToken = new LibrarianToken();
        librarianToken.librarianId = librarianId;
        librarianToken.token = token;
        librarianToken.expiresAt = expiresAt;

        return await this.librarianToken.save(librarianToken);
    }

    async getLibrarianToken(token:string): Promise<LibrarianToken>{
        return await this.librarianToken.findOne({
            token: token,
        });
    }

    async invalidateToken(token:string): Promise<LibrarianToken |ApiResponse>{
        const librarianToken = await this.librarianToken.findOne({
            token:token,
        });

        if(!librarianToken){
            return new ApiResponse("error",-10001, "No such refersh token!");
        }

        librarianToken.isValid = 0;

        await this.librarianToken.save(librarianToken);

        return await this.getLibrarianToken(token);
    }

    async invalidateLibrarianTokens(librarianId:number): Promise<(LibrarianToken | ApiResponse)[]>{
        const librarianTokens = await this.librarianToken.find({
            librarianId : librarianId,
        });

        const results = [];
        for(const librarianToken of librarianTokens){
            results.push(this.invalidateToken(librarianToken.token));
        }

        return results
    }
}
