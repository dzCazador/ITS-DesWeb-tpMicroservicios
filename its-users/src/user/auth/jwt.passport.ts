import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {envs} from '../../config'
import { PayloadInterface } from '../../common';
import { UserService } from '../user.service';

@Injectable()
export class JWTPassport extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,  // If the token is expired, it will not be rejected
            secretOrKey: envs.secredKey,
        });
    }

    // This method is called by Passport to validate the JWT token
    /**
     * Validates the JWT payload and retrieves the user.
     * @param payload - The decoded JWT payload containing user information.
     * @returns The user object if found, otherwise throws an UnauthorizedException.
     */
    
    async validate(payload:PayloadInterface){
        // Validar que 'payload.sub' existe antes de usarlo
        if (!payload.sub) {
        throw new UnauthorizedException('Payload sub is missing in the token.');
        }        
        try {
            return await this.userService.findOne(+payload.sub);
        } catch(err){
            throw new UnauthorizedException('User not found on Token'+ err)
        }
    }

}