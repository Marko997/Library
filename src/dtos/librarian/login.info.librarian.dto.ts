export class LoginInfoLibrarianDto{
    librarianId :number;
    username: string;
    token: string;

    constructor(id: number,un: string, jwt:string){
        this.librarianId = id;
        this.username = un;
        this.token = jwt;
    }
}