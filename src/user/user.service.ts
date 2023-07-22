import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { join } from 'path';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly usersFile = join(__dirname, 'users.json');

  async create(username: string, password: string) {
    const existingUser = this.findOne(username);

    if (existingUser) {
      return { status: HttpStatus.BAD_REQUEST, message: 'User already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashedPassword };

    const users = this.findAll();
    users.push(newUser);

    writeFileSync(this.usersFile, JSON.stringify(users));

    return { status: HttpStatus.CREATED, message: 'User created successfully', user: newUser };
  }

  findAll() {
    try {
      const users = readFileSync(this.usersFile, 'utf8');
      return JSON.parse(users);
    } catch (e) {
      return [];
    }
  }

  findOne(username: string) {
    const users = this.findAll();
    return users.find(user => user.username === username);
  }

  async validatePassword(username: string, password: string) {
    const user = this.findOne(username);

    if (!user) {
      return false;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    return isMatch;
  }
}
