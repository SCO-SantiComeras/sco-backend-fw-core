import { DynamicModule, Module, ModuleMetadata, Provider, Type, ValidationPipe } from "@nestjs/common";
import { CoreService } from "./core.service";
import { CoreController } from "./core.controller";
import { CoreConfig } from "./config/core.config";
import { LoggerService } from "./logger/logger.service";

interface CoreConfigFactory {
  createCoreConfig(): Promise<CoreConfig> | CoreConfig;
}

export interface CoreAsyncConfig extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<CoreConfigFactory>;
  useClass?: Type<CoreConfigFactory>;
  useFactory?: (...args: any[]) => Promise<CoreConfig> | CoreConfig;
}

@Module({})
export class CoreModule {
  static register(options: CoreConfig): DynamicModule {
    return {
      module: CoreModule,
      imports: [

      ],
      controllers: [
        CoreController,
      ],
      providers: [
        CoreService,
        LoggerService,
        ValidationPipe,
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
      ],
      exports: [
        CoreService,
        LoggerService,
      ],
      global: true,
    };
  }

  public static registerAsync(options: CoreAsyncConfig): DynamicModule {
    return {
      module: CoreModule,
      imports: [
        
      ],
      controllers: [
        CoreController,
      ],
      providers: [
        CoreService, 
        LoggerService,
        ValidationPipe,
        ...this.createConnectProviders(options)
      ],
      exports: [
        CoreService,
        LoggerService,
      ],
      global: true,
    };
  }

  private static createConnectProviders(options: CoreAsyncConfig): Provider[] {
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
        useFactory: async (optionsFactory: CoreConfigFactory) =>
          await optionsFactory.createCoreConfig(),
        inject: [options.useExisting || options.useClass],
      },
    ];
  }
}
