import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {UserDocument} from "../users/entities/user.entity";
import {LoginDto} from "./dto/login-dto";
import {Model} from "mongoose";
import * as bcrypt from 'bcryptjs'
import {UsersService} from "../users/users.service";


@Injectable()
export class AuthService {

    constructor(@InjectModel('users') private UserModel: Model<UserDocument>, private userService: UsersService) {

    }

    async loginUser(loginDto:LoginDto): Promise<LoginDto>{
        const {password,email} = loginDto;
        const user = await this.UserModel.findOne({'email':email}).select('+password');
        if(user && bcrypt.compareSync(password,user.password)) {
            const {firstname, lastname, email, role,id} = user;
            loginDto.status = true;
            loginDto.user = {firstname, lastname, email, role,id}
            loginDto.token = this.userService.generateToken(user);
        }
        return loginDto;
    }

}
