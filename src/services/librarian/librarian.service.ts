import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Librarian } from '../../../entities/librarian.entity';
import { Repository } from 'typeorm';
import { AddLibrarianDto } from '../../dtos/librarian/add.librarian.dto';
import { EditLibrarianDto } from '../../dtos/librarian/edit.librarian.dto';
import * as crypto from 'crypto';
import { ApiResponse } from '../../misc/api.response.class';


@Injectable()
export class LibrarianService {
    constructor(
        @InjectRepository(Librarian) private readonly librarian: Repository<Librarian> 
    ){}

    getAll(): Promise<Librarian[]>{
        return this.librarian.find();
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
}
