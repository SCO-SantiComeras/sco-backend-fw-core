import { IFileFunction } from "./ifile-function.interface";

export interface ICore {
    getFuntionFilesConstants(): IFileFunction[];
    validationPassportCallback(authorization: string): Promise<boolean>;
    getTypesConstants(): any;
}