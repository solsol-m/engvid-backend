import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(name: string, email: string, password: string): Promise<{
        user: import("../users/user.schema").UserDocument;
        token: string;
    }>;
    login(email: string, password: string): Promise<{
        user: import("../users/user.schema").UserDocument;
        token: string;
    }>;
}
