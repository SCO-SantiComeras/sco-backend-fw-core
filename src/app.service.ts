import { Injectable } from "@nestjs/common";
import { TYPES } from './../libs/sco-backend-fw-core/src/core/types/types.constants';
import { IFileFunction } from './../libs/sco-backend-fw-core/src/core/interfaces/ifile-function.interface';
import { ICore } from './../libs/sco-backend-fw-core/src/core/interfaces/icore.interface';

@Injectable()
export class AppService implements ICore {

    /* Add Own Dependencies */
    constructor(
        // Example: private readonly websocketsService: WebsocketsService,
    ) {}

    /*  Function Files Constants*/
    getFuntionFilesConstants(): IFileFunction[] {
        return [
            /* Global */
            {
                file: 'hello',
                path: 'global',
                resultType: 'string',
            },
        ];
    }

    /* Validation Passport */ 
    async validationPassportCallback(authorization: string): Promise<boolean> {
        if (!authorization) {
            return false;
        }

        return true;
    }

    /* Types */
    getTypesConstants(): any {
        return {
            ...TYPES,
        }
    }
}
