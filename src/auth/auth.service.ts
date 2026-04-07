import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(name: string, email: string, password: string) {
    const user = await this.usersService.create(name, email, password);
    const token = this.jwtService.sign({ sub: user._id, email: user.email });
    return { user, token };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('بيانات الدخول غير صحيحة');
    const token = this.jwtService.sign({ sub: user._id, email: user.email });
    return { user, token };
  }
}
