import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from "bcryptjs";
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService,
    ) { }
//logic registre
    async signUp(signUpDto : SignUpDto): Promise<{ token: string }> {
        const { username, email, password } = signUpDto;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.userModel.create({
            username,
            email,
            password: hashedPassword,
            role: 'user',
        });
        const token = this.jwtService.sign(
            //payload: data li nheb naamllha save f token li heya =>id
            { id: user._id },
            // { secret: this.configService.get<string>('JWT_SECRET') },
        );
        return { token };
    }
}
