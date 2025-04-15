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
import { Request } from "express";
import { User } from "../users/user.entity";

@Injectable()
export class GQLAuthGuard implements CanActivate {
  private client: JwksRsa.JwksClient;

  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
  ) {
    this.client = JwksRsa({
      jwksUri: new URL("/oauth/v2/keys", process.env.ZITADEL_ISSUER).toString(),
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const token = this.extractTokenFromHeader(ctx.req);

    if (!token) {
      return true;
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

      if (context.getType<GqlContextType>() === "graphql") {
        ctx.user = user as User;
      }
    } catch (e: any) {
      console.log(e);
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];
    return type === "Bearer" ? token : undefined;
  }
}
