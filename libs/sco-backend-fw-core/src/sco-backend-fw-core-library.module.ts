

import { Module } from '@nestjs/common';
import { ScoBackendFwCoreModule } from './sco-backend-fw-core/sco-backend-fw-core.module';

@Module({
  imports: [
    ScoBackendFwCoreModule,
  ],
  exports: [
    ScoBackendFwCoreModule,
  ],
})

export class ScoBackendFwCoreLibraryModule {}
