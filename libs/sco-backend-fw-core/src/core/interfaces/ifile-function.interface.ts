import { IFileFunctionParam } from "./ifile-function-param.interface";

export interface IFileFunction {
    file: string;
    path: string;
    params?: IFileFunctionParam[];
    resultType: string;
}