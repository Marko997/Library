import { SetMetadata } from "@nestjs/common"

export const AllowToRoles = (...roles: ("librarian" | "student")[]) => {
    return SetMetadata('allow_to_roles',roles);
};