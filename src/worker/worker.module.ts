import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      logging: true,
      extra: { max: 2 },
    }),
    QueueModule.register({
      consumers: ['dist/**/*.processor.js'],
    }),
  ],
  providers: [],
})
export class WorkerModule {}
