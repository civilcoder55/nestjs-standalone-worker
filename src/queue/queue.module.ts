import { DynamicModule, Module } from '@nestjs/common';
import { BullModule, WorkerHost } from '@nestjs/bullmq';
import { importClassesFromDirectories } from 'typeorm/util/DirectoryExportedClassesLoader';

@Module({})
export class QueueModule {
  public static readonly consumers = [];
  public static readonly dependencies = [];
  public static readonly queues = [];

  static async register(options: {
    consumers: string[];
  }): Promise<DynamicModule> {
    const workerClasses = await importClassesFromDirectories(
      { log: console.log } as any,
      options.consumers,
    );

    workerClasses.forEach((workerClass) => {
      if (workerClass.prototype instanceof WorkerHost) {
        QueueModule.consumers.push(workerClass);
        QueueModule.dependencies.push(
          ...(Reflect.getMetadata('dependencies', workerClass) || []),
        );
        QueueModule.queues.push(
          Reflect.getMetadata('bullmq:processor_metadata', workerClass),
        );
      }
    });

    return {
      module: QueueModule,
      imports: [
        BullModule.forRoot({
          connection: {
            host: 'localhost',
            port: 6379,
          },
        }),
        BullModule.registerQueue(...QueueModule.queues),
        ...QueueModule.dependencies,
      ],
      providers: [...QueueModule.consumers],
    };
  }
}
