import { Processor, Process } from "@nestjs/bull";
import { Job as BullJob } from "bull";
import { JobService } from "./job.service";
import { JobStatus } from "./job.entity";

@Processor("jobs-queue")
export class JobProcessor {
  constructor(private readonly jobsService: JobService) {}

  @Process("email")
  async handleEmail(job: BullJob) {
    console.log("Processing job:", job.name, job.data);

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
    }
  }

  @Process("report")
  async handleReport(job: BullJob) {
    console.log("Processing job:", job.name, job.data);

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
