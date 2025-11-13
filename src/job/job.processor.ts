import { Processor, Process, InjectQueue } from "@nestjs/bull";
import { Job as BullJob, Queue } from "bull";
import { JobService } from "./job.service";
import { JobStatus } from "./job.entity";

@Processor("jobs-queue")
export class JobProcessor {
  constructor(
    private readonly jobsService: JobService,
    @InjectQueue("failed-jobs") private readonly failedJobsQueue: Queue
  ) {}

  @Process({ name: "email", concurrency: 50 })
  async handleEmail(job: BullJob) {
    // console.log("Processing job:", job.name, job.data);
    const now = new Date().toISOString();
    console.log(`[${now}] Processing job ${job.id} (${job.name})`);

    const { id, ...data } = job.data;

    try {
      // Simulate processing based on type
      await this.fakeEmailSend(data);

      // Update DB as completed
      await this.jobsService.updateStatus(id, JobStatus.COMPLETED);
      console.log(`✅ Job ${id} completed`);
    } catch (err) {
      console.error(`❌ Job ${id} failed`, err);
      await this.jobsService.updateStatus(id, JobStatus.FAILED);
      const maxAttempts = job.opts.attempts || 1;
      if (job.attemptsMade >= maxAttempts) {
        console.log(`🚨 Moving job ${job.id} to DLQ`);
        await this.failedJobsQueue.add(job.name, job.data);
      }
      throw err;
    } finally {
      console.log(`[${now}] ✅ Done job ${job.id}`);
    }
  }

  @Process({ name: "report", concurrency: 50 })
  async handleReport(job: BullJob) {
    // console.log("Processing job:", job.name, job.data);
    const now = new Date().toISOString();
    console.log(`[${now}] Processing job ${job.id} (${job.name})`);

    const { id, ...data } = job.data;

    try {
      // Simulate processing based on type
      await this.fakeReportGen(data);

      // Update DB as completed
      await this.jobsService.updateStatus(id, JobStatus.COMPLETED);
      console.log(`✅ Job ${id} completed`);
    } catch (err) {
      console.error(`❌ Job ${id} failed`, err);
      await this.jobsService.updateStatus(id, JobStatus.FAILED);
      const maxAttempts = job.opts.attempts || 1;
      if (job.attemptsMade >= maxAttempts) {
        console.log(`🚨 Moving job ${job.id} to DLQ`);
        await this.failedJobsQueue.add(job.name, job.data);
      }
      throw err;
    } finally {
      console.log(`[${now}] ✅ Done job ${job.id}`);
    }
  }

  private async fakeEmailSend(data: any) {
    await new Promise((res) => setTimeout(res, 2000));
    console.log("Sent email:", data.to);
  }

  private async fakeReportGen(data: any) {
    await new Promise((res) => setTimeout(res, 3000));
    console.log("Generated report for:", data.user_id);
  }
}
