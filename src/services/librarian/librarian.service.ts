import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Librarian } from 'entities/librarian.entity';
import { Repository } from 'typeorm';

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
}
