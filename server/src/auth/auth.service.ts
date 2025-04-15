import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async findUser(email: string) {
    return await this.usersService.findByEmail(email);
  }

  async findOrCreateUser(email: string) {
    const user = await this.findUser(email);

    if (user) {
      return user;
    }

    if (!user) {
      await this.usersService.create({ email });
    }

    return await this.findUser(email);
  }
}
