import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(username: string, email: string, pass: string, referralCode?: string) {
    const existingUser = await this.userService.findOne(username);
    if (existingUser) throw new ConflictException('Username already exists');

    const hashedPassword = await bcrypt.hash(pass, 10);
    
    // Find referrer by code if provided
    let referredById: string | undefined;
    if (referralCode) {
      const referrer = await this.prisma.user.findUnique({
        where: { referralCode },
      });
      if (referrer) {
        referredById = referrer.id;
      }
    }

    const user = await this.userService.create({
      username,
      email,
      password: hashedPassword,
      ...(referredById && { referredById }), // Conditional spread
    } as any); // Bypass TypeScript until Prisma generates

    const { password, ...result } = user;
    return result;
  }

  async login(username: string, pass: string) {
    const user = await this.userService.findOne(username);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        balance: user.balance,
      },
    };
  }
}
