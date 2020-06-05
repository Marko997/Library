import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from '../config/database.configuration';
import { Librarian } from './entities/librarian.entity';
import { LibrarianService } from './services/librarian/librarian.service';
import { Author } from './entities/author.entity';
import { Book } from './entities/book.entity';
import { Category } from './entities/category.entity';
import { Loan } from './entities/loan.entity';
import { Photo } from './entities/photo.entity';
import { Reservation } from './entities/reservation.entity';
import { Student } from './entities/student.entity';
import { LibrarianController } from './controllers/api/librarian.controller';
import { CategoryController } from './controllers/api/category.controller';
import { CategoryService } from './services/category/category.service';
import { BookService } from './services/book/book.service';
import { BookController } from './controllers/api/book.controller';
import { AuthorController } from './controllers/api/author.controller';
import { AuthorService } from './services/author/author.service';
import { LoanController } from './controllers/api/loan.controller';
import { LoanService } from './services/loan/loan.service';
import { PhotoController } from './controllers/api/photo.controller';
import { PhotoService } from './services/photo/photo.service';
import { ReservationController } from './controllers/api/reservation.controller';
import { ReservationService } from './services/reservation/reservation.service';
import { StudentController } from './controllers/api/student.controller';
import { StudentService } from './services/student/student.service';
import { AuthController } from './controllers/api/auth.controller';
import { AuthMiddleware } from './middlewares/auth.middleware';



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
    TypeOrmModule.forFeature([ 
      Librarian,
      Category,
      Book,
      Author,
      Loan,
      Photo,
      Reservation,
      Student
    ])
  ],
  controllers: [
    AppController,
    LibrarianController,
    CategoryController,
    BookController,
    AuthorController,
    LoanController,
    PhotoController,
    ReservationController,
    StudentController,
    AuthController,
  ],
  providers: [
    LibrarianService,
    CategoryService,
    BookService,
    AuthorService,
    LoanService,
    PhotoService,
    ReservationService,
    StudentService
  ],
  exports:[
    LibrarianService,
    StudentService,
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('auth/*')
      .forRoutes('api/*')
  }
}
