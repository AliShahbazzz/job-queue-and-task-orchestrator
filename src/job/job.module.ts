import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Job } from "./job.entity";
import { JobService } from "./job.service";
import { JobController } from "./job.controller";
import { BullModule } from "@nestjs/bull";
import { JobProcessor } from "./job.processor";

@Module({
  imports: [
    TypeOrmModule.forFeature([Job]),
    BullModule.registerQueue({
      name: "jobs-queue",
    }),
  ],
  providers: [JobService, JobProcessor],
  controllers: [JobController],
  exports: [JobService],
})
export class JobModule {}
