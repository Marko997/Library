export class LoginInfoDto{
    id :number;
    username: string;
    token: string;

    

    constructor(id: number,un: string, jwt:string){
        this.id = id;
        this.username = un;
        this.token = jwt;
    }
}