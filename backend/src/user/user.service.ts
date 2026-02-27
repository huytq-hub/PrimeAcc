import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findOne(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
    });
  }

  async updateBalance(userId: string, amount: number, type: 'ADD' | 'SUBTRACT') {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw new Error('User not found');

      const currentBalance = Number(user.balance);
      const newBalance = type === 'ADD' ? currentBalance + amount : currentBalance - amount;

      if (newBalance < 0) throw new Error('Insufficient balance');

      return tx.user.update({
        where: { id: userId },
        data: { balance: newBalance },
      });
    });
  }
}
