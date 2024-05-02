import { Type } from "@nestjs/common";

export interface IFileFunctionParam {
    name: string;
    type: string;
    optional?: boolean;
    dto?: Type<any>;
}