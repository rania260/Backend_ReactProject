import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from "bcryptjs";
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService,
        private configService: ConfigService,

    ) { }
    //logic registre
    async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
        const {  email, password } = signUpDto;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.userModel.create({
           // username,
            email,
            password: hashedPassword,
            role: 'user',
        });
        const token = this.jwtService.sign(
            //payload: data li nheb naamllha save f token li heya =>id
            { id: user._id },
            { secret: this.configService.get<string>('JWT_SECRET') },

        );
        return { token };
    }
    //logic login
    async login(loginDto: LoginDto): Promise<{ token: string }> {
        const { email, password } = loginDto;
        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new UnauthorizedException('Email is incorrect');
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            throw new UnauthorizedException('Password is incorrect');
        }
        const token = this.jwtService.sign(
            { id: user._id },
            { secret: this.configService.get<string>('JWT_SECRET') },

        );
        return { token };
    }
}
