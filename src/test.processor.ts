import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Processor('test', { concurrency: 3 })
export class TestProcessor extends WorkerHost {
  private readonly logger = new Logger(TestProcessor.name);

  constructor(@InjectDataSource() private readonly datasource: DataSource) {
    super();
  }

  async process(job: Job<any, any, string>) {
    this.logger.log(`Processing job ${job.id}`);
    this.logger.log(job.data);

    // long running query
    // await this.datasource.query('SELECT pg_sleep(1 * 60)');

    // event loop blocking code
    //  while (true) {}
  }
}
