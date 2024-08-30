import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    @InjectQueue('test')
    private readonly queue: Queue,
    @InjectDataSource() private readonly datasource: DataSource,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async addJob() {
    await this.datasource.query('SELECT NOW()');

    this.logger.log('Adding job to queue');

    await this.queue.add('testJob', { message: 'hello from queue' });
  }
}
