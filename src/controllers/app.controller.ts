import { Controller, Get } from '@nestjs/common';
import { Librarian } from '../../entities/librarian.entity';
import { LibrarianService } from '../services/librarian/librarian.service';

@Controller()
export class AppController {
  constructor(
    private librarianService: LibrarianService
  ){}
  @Get() //http:localhost:3000/
  getHomePage(): string {
    return 'Hello World!';
  }
  
  
  
}
