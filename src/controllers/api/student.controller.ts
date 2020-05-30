import { Controller, Get, Param, Put, Body, Post } from "@nestjs/common";
import { AddStudentDto } from "../../dtos/student/add.student.dto";
import { EditStudentDto } from "../../dtos/student/edit.student.dto";
import { ApiResponse } from "../../misc/api.response.class";
import { async } from "rxjs/internal/scheduler/async";
import { StudentService } from "../../services/student/student.service";
import { Student } from "../../../entities/student.entity";


@Controller('api/student')
export class StudentController {
    constructor(
        private studentService: StudentService
    ){}


  // GET http://localhost:3000/api/student
    @Get() 
  getAllStudents(): Promise<Student[]> {
    return this.studentService.getAll();
  }

  // GET http://localhost:3000/api/student/1
    @Get(':id') 
   getById( @Param('id') studentId:number): Promise<Student | ApiResponse> {

    return new Promise(async (resolve)=>{
      let student = await this.studentService.getById(studentId);
      if(student === undefined){
        resolve(new ApiResponse("error", -1002));
      }
      resolve(student);

    });
    
  }
  
// PUT http://localhost:3000/api/student
@Put()  
add( @Body() data:AddStudentDto): Promise<Student | ApiResponse>{
    return this.studentService.add(data);
}
  
// POST http://localhost:3000/api/student/1
@Post(':id')
edit(@Param('id') id: number, @Body() data: EditStudentDto): Promise<Student | ApiResponse>{
    return this.studentService.editById(id,data);
}
}