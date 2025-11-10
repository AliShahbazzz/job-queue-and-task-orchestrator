import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

export enum JobStatus {
  QUEUED = "QUEUED",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

@Entity()
export class Job {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  type: string; // e.g., "email", "report", etc.

  @Column({ type: "jsonb", nullable: true })
  payload: Record<string, any>; // job data

  @Column({ type: "enum", enum: JobStatus, default: JobStatus.QUEUED })
  status: JobStatus;

  @Column({ nullable: true })
  result: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
