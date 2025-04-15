import * as JwksRsa from "jwks-rsa";
import * as jwt from "jsonwebtoken";

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";

import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { User } from "../users/user.entity";

export const AuthRequired = Reflector.createDecorator<boolean>();

@Injectable()
export class AuthGuard implements CanActivate {
  private client: JwksRsa.JwksClient;

  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private reflector: Reflector,
  ) {
    this.client = JwksRsa({
      jwksUri: new URL("/oauth/v2/keys", process.env.ZITADEL_ISSUER).toString(),
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let token: string | undefined;

    switch (context.getType<GqlContextType>()) {
      case "http":
        const request = context.switchToHttp().getRequest();
        token = this.extractTokenFromHeader(request);
        break;
      case "graphql":
        const ctx = GqlExecutionContext.create(context).getContext();
        token = this.extractTokenFromHeader(ctx.req);
        break;
      default:
        return true;
    }

    const authRequired = this.reflector.get(AuthRequired, context.getHandler());

    if (!token && !authRequired) {
      return true;
    } else if (!token) {
      throw new UnauthorizedException();
    }

    const decoded = jwt.decode(token, { complete: true });
    const kid = decoded!.header.kid;

    const key = await this.client.getSigningKey(kid);
    const publicKey = key.getPublicKey();

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        publicKey,
        issuer: process.env.ZITADEL_ISSUER,
        algorithms: ["RS256"],
      });

      const user = await this.authService.findOrCreateUser(payload.email);

      if (!user) return false;

      switch (context.getType<GqlContextType>()) {
        case "http":
          const request = context.switchToHttp().getRequest();
          request.user = payload;
          break;
        case "graphql":
          const ctx = GqlExecutionContext.create(context).getContext();
          ctx.user = user as User;
          break;
        default:
          return true;
      }
    } catch (e: any) {
      console.error(e);
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
