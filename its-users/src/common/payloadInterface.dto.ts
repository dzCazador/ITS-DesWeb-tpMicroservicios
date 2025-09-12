import { Role } from "./enums/role.enum"

export class PayloadInterface{
    sub: number | undefined
    email: string | undefined
    name: string | undefined
    role: Role | undefined
}