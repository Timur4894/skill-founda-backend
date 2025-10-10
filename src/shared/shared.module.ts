import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'super_secret_key_REPLACELATER',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  exports: [JwtModule],
})
export class SharedModule {}
