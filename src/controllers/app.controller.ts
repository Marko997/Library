import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(
    
  ){}
  @Get() //http:localhost:3000/
  getHomePage(): string {
    return 'Hello World!';
  }
  
  
  
}
