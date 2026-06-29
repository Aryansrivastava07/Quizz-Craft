import { Module } from '@nestjs/common';
import { Db } from './db.providers';

@Module({
  providers: [...Db],
  exports: [...Db],
})
export class DbModule {}
