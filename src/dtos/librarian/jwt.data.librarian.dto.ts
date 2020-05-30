export class JwtDataLibrarianDto {
    librarianId: number;
    username: string;
    exp: number;
    ip: string;
    ua:string;

    toPlainObject()
    {
        return{
            librarianId: this.librarianId,
            username: this.username,
            exp: this.exp,
            ip: this.ip,
            ua: this.ua
        }
    }

}