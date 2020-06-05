import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddStudentDto } from '../../dtos/student/add.student.dto';
import { EditStudentDto } from '../../dtos/student/edit.student.dto';
import * as crypto from 'crypto';
import { ApiResponse } from '../../misc/api.response.class';
import { Student } from '../../entities/student.entity';


@Injectable()
export class StudentService {
    constructor(
        @InjectRepository(Student) private readonly student: Repository<Student> 
    ){}

    getAll(): Promise<Student[]>{
        return this.student.find();
    }

    async getById(id: number): Promise<Student>{
        return await this.student.findOne(id);
    }

    async getByUsername (usernameS: string):Promise<Student | null>{
        const student = await this.student.findOne({
            username: usernameS
        });
        if(student){
            return student;
        }
    }

    add(data: AddStudentDto ): Promise<Student | ApiResponse>{
        

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);

        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        const newStudent: Student = new Student();
        newStudent.username = data.username;
        newStudent.passwordHash = passwordHashString;
        newStudent.forename = data.forename;
        newStudent.surename = data.surename;
        newStudent.phoneNumber = data.phoneNumber;
        newStudent.classNumber = data.classNumber;

        return new Promise((resolve)=>{
            this.student.save(newStudent)
            .then(data => resolve (data))
            .catch(error => {
                const response: ApiResponse = new ApiResponse("error",-1001);
                resolve(response);
            })
        });
        
    }

    async editById(id: number, data: EditStudentDto):Promise<Student | ApiResponse>{
        let oldStudent = await this.student.findOne(id);

        if(oldStudent === undefined){
            return new Promise ((resolve)=>{
                resolve(new ApiResponse("error", -1002));
            }
            )
        }

        

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);

        const passwordHashString = passwordHash.digest('hex').toUpperCase();


        oldStudent.passwordHash = passwordHashString;
        oldStudent.phoneNumber= data.phonenumber;
        oldStudent.classNumber= data.classNumber;

        return this.student.save(oldStudent);
    }
}
