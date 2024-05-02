import { IFileFunctionParam } from "./ifile-function-param.interface";

export interface IFileFunctionResponse {
    file: string;
    path?: string;
    params?: IFileFunctionParam[];
    resultType: string;
    result: any;
    success: boolean;
}