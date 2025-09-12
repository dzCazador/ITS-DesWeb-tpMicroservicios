import { Role } from "src/common/enums/role.enum";

export interface PayloadInterface {
    sub: number;
    email: string;
    name: string;
    role: Role; 
}
