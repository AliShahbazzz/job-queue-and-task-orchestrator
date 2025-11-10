import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Import the ConfigModule
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: configService.get<string>("POSTGRESQL_DB_USERNAME"),
        password: configService.get<string>("POSTGRESQL_DB_PASSWORD"),
        database: "job_orchestrator",
        autoLoadEntities: true, // automatically loads all entities
        synchronize: true, // ⚠️ auto-create tables in dev mode
        logging: true,
      }),
      inject: [ConfigService], // Inject the ConfigService
    }),
  ],
})
export class DatabaseModule {}
