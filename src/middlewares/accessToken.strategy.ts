import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        '6bc7b4fe0729603201be192a200b5e76ba4727ec80c72c6aa6b9sk_59882e8443d670a', //process.env.JWT_ACCESS_SECRET,
    });
  }
  async validate(payload: any) {
    return {
      userId: payload.id,
      email: payload.email,
      phone_number: payload.phone_number,
      verified: payload.verified,
    };
  }
}
