import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity'; // Adjust the path accordingly
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(username: string, password: string, email: string) {
    const existingUser = await this.findOne(username);

    if (existingUser) {
      return { status: HttpStatus.BAD_REQUEST, message: 'User already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      username,
      password: hashedPassword,
      email,
    });

    await this.userRepository.save(newUser);

    return {
      status: HttpStatus.CREATED,
      message: 'User created successfully',
      user: newUser,
    };
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }
  
  async findByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }
  

  async validatePassword(username: string, password: string): Promise<boolean> {
    const user = await this.findOne(username);

    if (!user) {
      return false;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
  }
}
