import { Controller, Post, Body, Get } from "@nestjs/common";
import { JobService } from "./job.service";

@Controller("jobs")
export class JobController {
  constructor(private readonly jobsService: JobService) {}

  @Post()
  async createJob(@Body() body: { type: string; payload: any }) {
    return this.jobsService.createJob(body.type, body.payload);
  }

  @Get()
  async getAllJobs() {
    return this.jobsService.getJobs();
  }
}
