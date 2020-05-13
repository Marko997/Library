import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from '../config/database.configuration';
import { Librarian } from '../entities/librarian.entity';
import { LibrarianService } from './services/librarian/librarian.service';
import { Author } from '../entities/author.entity';
import { Book } from '../entities/book.entity';
import { Category } from '../entities/category.entity';
import { Loan } from '../entities/loan.entity';
import { Photo } from '../entities/photo.entity';
import { Reservation } from '../entities/reservation.entity';
import { Student } from '../entities/student.entity';
import { LibrarianControler } from './controllers/api/librarian.controller';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: DatabaseConfiguration.hostname,
      port: 3306,
      username: DatabaseConfiguration.username,
      password: DatabaseConfiguration.password,
      database: DatabaseConfiguration.database,
      entities: [
        Author,
        Book,
        Category,
        Librarian,
        Loan,
        Photo,
        Reservation,
        Student
      ]
    }),
    TypeOrmModule.forFeature([ Librarian ])
  ],
  controllers: [
    AppController,
    LibrarianControler,
  ],
  providers: [LibrarianService],
})
export class AppModule {}
