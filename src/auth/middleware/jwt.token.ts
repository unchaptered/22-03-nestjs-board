import { InjectRepository } from "@nestjs/typeorm";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";

import { ExtractJwt, Strategy } from "passport-jwt";
import { UserRepository } from "../user.repository";
import { User } from "../entity/user.entity";

import * as config from "config";

export class JwtStrategy extends PassportStrategy(Strategy) {
    
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ) {
        super({
            secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    
    async validate(payload) {
        
        const { username } = payload;

        const user:User = await this.userRepository.findOne({ username });
        if (!user) throw new UnauthorizedException();

        return user;

    }
}