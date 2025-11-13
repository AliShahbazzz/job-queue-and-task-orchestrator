import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Job, JobStatus } from "./job.entity";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
    @InjectQueue("jobs-queue")
    private readonly jobQueue: Queue
  ) {}

  async createJob(type: string, payload: any) {
    // Step 1: Save in DB
    const job = this.jobRepo.create({ type, payload });
    const savedJob = await this.jobRepo.save(job);

    console.log("added to database");
    // Step 2: Enqueue in Redis
    await this.jobQueue.add(
      type,
      { id: savedJob.id, ...payload },
      {
        attempts: 3, // retry 3 times
        backoff: {
          type: "exponential",
          delay: 5000, // 5s, then 10s, then 20s
        },
        removeOnComplete: true, // clean up successful jobs
      }
    );
    console.log("Job added:", savedJob.id);
    console.log("added to queue");

    return savedJob;
  }

  async getJobs() {
    return this.jobRepo.find();
  }

  async updateStatus(id: string, status: JobStatus) {
    await this.jobRepo.update(id, { status });
  }
}
