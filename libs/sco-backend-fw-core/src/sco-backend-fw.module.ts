import { CoreModule } from './core/core.module';

import { Module } from '@nestjs/common';

@Module({
  imports: [
    CoreModule,
  ],
  providers: [

  ],
  exports: [
    CoreModule,
  ],
})

export class ScoBackendFwModule {}
