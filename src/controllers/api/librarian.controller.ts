import { Controller, Get, Param, Put, Body, Post, SetMetadata, UseGuards } from "@nestjs/common";
import { LibrarianService } from "../../../src/services/librarian/librarian.service";
import { Librarian } from "../../entities/librarian.entity";
import { AddLibrarianDto } from "../../dtos/librarian/add.librarian.dto";
import { EditLibrarianDto } from "../../dtos/librarian/edit.librarian.dto";
import { ApiResponse } from "../../misc/api.response.class";
import { async } from "rxjs/internal/scheduler/async";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { RoleCheckedGuard } from "src/misc/role.checked.guard";


@Controller('api/librarian')
export class LibrarianController {
    constructor(
        private librarianService: LibrarianService
    ){}


  // GET http://localhost:3000/api/librarian
    @Get() 
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('librarian')
    getAllLibrarians(): Promise<Librarian[]> {
      return this.librarianService.getAll();
  }

  // GET http://localhost:3000/api/librarian/1
    @Get(':id') 
    @UseGuards(RoleCheckedGuard)
    @AllowToRoles('librarian')
    getById( @Param('id') librarianId:number): Promise<Librarian | ApiResponse> {

      return new Promise(async (resolve)=>{
      let librarian = await this.librarianService.getById(librarianId);
      if(librarian === undefined){
        resolve(new ApiResponse("error", -1002));
      }
      resolve(librarian);

    });
    
  }
  
// PUT http://localhost:3000/api/librarian
@Put()  
@UseGuards(RoleCheckedGuard)
@AllowToRoles('librarian')
add( @Body() data:AddLibrarianDto): Promise<Librarian | ApiResponse>{
    return this.librarianService.add(data);
}
  
// POST http://localhost:3000/api/librarian/1
@Post(':id')
@UseGuards(RoleCheckedGuard)
@AllowToRoles('librarian')
edit(@Param('id') id: number, @Body() data: EditLibrarianDto): Promise<Librarian | ApiResponse>{
    return this.librarianService.editById(id,data);
}
}