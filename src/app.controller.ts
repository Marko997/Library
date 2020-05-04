import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHomePage(): string {
    return 'Hello World!';
  }
  @Get('/contact')
  get(): string {
    return 'Contact info...';
  }
  @Get('/aboutUs')
  getAboutUs(): string {
    return 'About us...';
  }
}
