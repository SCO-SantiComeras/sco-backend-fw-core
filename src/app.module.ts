import { Module } from '@nestjs/common';
import { ScoBackendFwCoreModule } from './../libs/sco-backend-fw-core/src/sco-backend-fw-core/sco-backend-fw-core.module';
 
@Module({
  imports: [
    ScoBackendFwCoreModule.register({}),
  ],
  providers: [

  ],
})

export class AppModule {}
