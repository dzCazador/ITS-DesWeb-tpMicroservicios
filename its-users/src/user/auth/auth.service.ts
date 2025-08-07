import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {UpdateUserDto} from '../dto/update-user.dto'
import {PayloadInterface} from '../../common'
@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) { }

    /**
     * Creates a JSON Web Token (JWT) for authentication purposes.
     * @param user - The user object containing the user's id and email.
     * @returns A string representing the JWT.
     * @remarks
     * This function takes a user object, extracts the user's id and email,
     * creates a payload with these details, and then signs the payload using
     * the JWT service to generate a JWT.
     * @example
     * const user: UpdateUserDto = { id: 1, email: 'user@example.com' };
     * const jwtToken = authService.createJWT(user);
     * console.log(jwtToken); // Output: <JWT_TOKEN>
     */
    createJWT(user: UpdateUserDto): string {
        // create a payload with the user's id and email
        const { id: sub, email } = user || {};
        const payload: PayloadInterface = {
            sub,
            email,
        };

        return this.jwtService.sign(payload);
    }

    /**
     * Verifies and decodes a JSON Web Token (JWT) for authentication purposes.
     * @param token - The JWT token to verify and decode.
     * @returns The decoded payload containing the user's id and email.
     * @remarks
     * This function takes a JWT token, verifies it, and decodes the payload
     * to extract the user's id and email. If the token is invalid or expired,
     * an error will be thrown.
     * @example
     * const jwtToken = '<JWT_TOKEN>';
     * const payload: PayloadInterface = authService.checkJWT(jwtToken);
     * console.log(payload); // Output: { sub: 1, email: 'user@example.com' }
     */
    checkJWT(token: string): PayloadInterface {
        // verify and decode the JWT
        return this.jwtService.verify(token);
    }


     /**
     * Hashes a plain text password using bcrypt.
     * @param password - The plain text password to hash.
     * @returns A promise that resolves to the hashed password.
     */
    hashPassword(password: string): Promise<string>{
        // hash the password using bcrypt with a salt
        const saltOrRounds = 12;
        // generate a salt and hash the password
        return bcrypt.hash(password, saltOrRounds);
    }

    /**
     * Compares a plain text password with a hashed password using bcrypt.
     * @param password - The plain text password to compare.
     * @param hashPassword - The hashed password to compare against.
     * @returns A promise that resolves to `true` if the password matches the hashed password,
     *          and `false` otherwise.
     */
    passwordCompare(password: string, hashPassword: string): Promise<boolean> {
        // compare the password with the hashed password
        return bcrypt.compare(password, hashPassword);
    }

}

