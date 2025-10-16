import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from './email.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'super_secret_key_REPLACELATER',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [EmailService],
  exports: [JwtModule, EmailService],
})
export class SharedModule {}
