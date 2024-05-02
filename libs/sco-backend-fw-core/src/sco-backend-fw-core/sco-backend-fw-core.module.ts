import { DynamicModule, Module, ModuleMetadata, Provider, Type } from "@nestjs/common";
import { ScoBackendFwCoreConfig } from "./config/sco-backend-fw-core.config";
import { ScoBackendFwCoreService } from "./sco-backend-fw-core.service";

interface ScoBackendFwCoreConfigFactory {
    createScoBackendFwCoreConfig(): Promise<ScoBackendFwCoreConfig> | ScoBackendFwCoreConfig;
  }
  
  export interface ScoBackendFwCoreAsyncConfig extends Pick<ModuleMetadata, 'imports'> {
    inject?: any[];
    useExisting?: Type<ScoBackendFwCoreConfigFactory>;
    useClass?: Type<ScoBackendFwCoreConfigFactory>;
    useFactory?: (...args: any[]) => Promise<ScoBackendFwCoreConfig> | ScoBackendFwCoreConfig;
  }

@Module({
})
export class ScoBackendFwCoreModule {
    static register(options: ScoBackendFwCoreConfig): DynamicModule {
        return {
          module: ScoBackendFwCoreModule,
          imports: [
    
          ],
          controllers: [
            
          ],
          providers: [
            ScoBackendFwCoreService,
            {
              provide: 'CONFIG_OPTIONS',
              useValue: options,
            },
          ],
          exports: [
            ScoBackendFwCoreService,
          ],
          global: true,
        };
    }

    public static registerAsync(options: ScoBackendFwCoreAsyncConfig): DynamicModule {
        return {
          module: ScoBackendFwCoreModule,
          imports: [
            
          ],
          controllers: [

          ],
          providers: [
           ScoBackendFwCoreService,
            ...this.createConnectProviders(options)
          ],
          exports: [
            ScoBackendFwCoreService,
          ],
          global: true,
        };
      }

    private static createConnectProviders(options: ScoBackendFwCoreAsyncConfig): Provider[] {
        if (options.useFactory) {
          return [
            {
              provide: 'CONFIG_OPTIONS',
              useFactory: options.useFactory,
              inject: options.inject || [],
            },
          ];
        }
    
        return [
          {
            provide: 'CONFIG_OPTIONS',
            useFactory: async (optionsFactory: ScoBackendFwCoreConfigFactory) =>
              await optionsFactory.createScoBackendFwCoreConfig(),
            inject: [options.useExisting || options.useClass],
          },
        ];
    }
 }
