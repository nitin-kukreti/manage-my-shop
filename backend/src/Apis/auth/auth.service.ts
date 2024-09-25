import { UserModel } from 'src/model/User.model';
import { AuthUserDto } from './register.dto'; // DTO for user registration payload
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service'; // Service to handle user-related logic
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariable } from 'src/config/config.interface';
import { AuthUserInfoInterface } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService, // Inject the UserService to manage users
    private readonly jwtService: JwtService, // Inject JwtService to handle JWT operations
    private readonly configService: ConfigService<EnvironmentVariable>,
  ) {}

  // Method to create a new user
  async createUser(payload: AuthUserDto): Promise<UserModel> {
    return await this.userService.createUser(payload); // Delegates user creation to the user service
  }

  // Method to authenticate user by email and password
  async authenticateUser(
    email: string,
    password: string,
  ): Promise<AuthUserInfoInterface> {
    // fetch user
    const user = await this.userService.getUserByEmailId(email);

    if (!user) {
      return null;
    }

    // Compare provided password with the stored hashed password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return null;
    }

    // Extract user roles and shops, to be included in the JWT payload
    const payloadUser = this.processUser(user);

    return payloadUser;
  }

  private processUser(user: UserModel) {
    const roles = user.shopUserRoles.map(({ role, shop }) => ({
      role: role.name,
      shop: shop?.id,
    }));

    // Construct the payload for JWT token
    const payloadUser = { id: user.id, email: user.email, roles };
    return payloadUser;
  }

  async loginUser(data: AuthUserInfoInterface) {
    const token = await this.jwtService.signAsync(data);
    delete data.roles;
    const refreshToken = await this.jwtService.signAsync(data, {
      secret: this.configService.get('auth.refreshTokenSecret', {
        infer: true,
      }),
      expiresIn: this.configService.get('auth.refreshExpire', { infer: true }),
    });
    return { token, refreshToken };
  }

  async issueToken(id: number): Promise<string> {
    const user = await this.userService.getUserById(id);
    const data = this.processUser(user);
    return await this.jwtService.signAsync(data);
  }
}
