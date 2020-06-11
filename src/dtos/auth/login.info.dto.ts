export class LoginInfoDto{
    id :number;
    username: string;
    token: string;
    refershToken: string;
    refershTokenExpiresAt: string;

    

    constructor(id: number,un: string, jwt:string, refreshToken: string, refreshTokenExpiresAt: string){
        this.id = id;
        this.username = un;
        this.token = jwt;
        this.refershToken = refreshToken;
        this.refershTokenExpiresAt = refreshTokenExpiresAt;
    }
}