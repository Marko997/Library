export class JwtDataLibrarianDto {
    librarianId: number;
    username: string;
    ext: number;
    ip: string;
    ua:string;

    toPlainObject()
    {
        return{
            librarianId: this.librarianId,
            username: this.username,
            ext: this.ext,
            ip: this.ip,
            ua: this.ua
        }
    }

}