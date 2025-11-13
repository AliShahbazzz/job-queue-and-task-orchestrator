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
    BullModule.registerQueue(
      {
        name: "jobs-queue",
        limiter: {
          max: 30, // maximum 30 jobs
          duration: 1000, // per 1000ms (1 second)
        },
      },
      { name: "failed-jobs" }
    ),
  ],
  providers: [JobService, JobProcessor],
  controllers: [JobController],
  exports: [JobService],
})
export class JobModule {}
