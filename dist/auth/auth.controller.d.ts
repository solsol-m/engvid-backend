import { AuthService } from './auth.service';
declare class RegisterDto {
    name: string;
    email: string;
    password: string;
}
declare class LoginDto {
    email: string;
    password: string;
}
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        user: import("../users/user.schema").UserDocument;
        token: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: import("../users/user.schema").UserDocument;
        token: string;
    }>;
}
export {};
