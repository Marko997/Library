import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from 'config/database.configuration';
import { Librarian } from 'entities/librarian.entity';
import { LibrarianService } from './services/librarian/librarian.service';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: DatabaseConfiguration.hostname,
      port: 3306,
      username: DatabaseConfiguration.username,
      password: DatabaseConfiguration.password,
      database: DatabaseConfiguration.database,
      entities: [Librarian]
    }),
    TypeOrmModule.forFeature([ Librarian ])
  ],
  controllers: [AppController],
  providers: [LibrarianService],
})
export class AppModule {}
