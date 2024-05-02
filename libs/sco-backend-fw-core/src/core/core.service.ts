import { Inject, Injectable, ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as ts from "typescript";
import { IFileFunction } from './interfaces/ifile-function.interface';
import { CoreConfig } from './config/core.config';
import { TYPES } from './types/types.constants';

@Injectable()
export class CoreService {

  private _filesPath: string;
  private _filesFolder: string;
  private _filesExtension: string;

  private _FUNCTION_FILES: IFileFunction[];
  private _TYPES = TYPES;

  constructor(
    @Inject('CONFIG_OPTIONS') private options: CoreConfig,
    private readonly validationPipe: ValidationPipe,
  ) {
    this._filesPath = this.options.path || './src';
    this._filesFolder = this.options.folder || 'functions';
    this._filesExtension = this.options.extension || 'ts';
  }

  public setFunctionFilesConstantsHeader(constant: any): IFileFunction[] {
    const format: IFileFunction[] = constant;
    this._FUNCTION_FILES = format;
    return this._FUNCTION_FILES;
  }

  public setTypes(constant: any): any {
    let deleteTypes: string[] = [];
    for (const type of Object.keys(constant)) {
      const existType: string = Object.keys(TYPES).find(t => t.toUpperCase() == type.toUpperCase());
      if (existType) {
        deleteTypes.push(type);
      }
    }

    const headerTypes: any = {};
    const keys: string[] = Object.keys(constant);
    if (keys && keys.length > 0) {
      for (const type of keys) {
        const existType: string = deleteTypes.find(t => t.toUpperCase() == type.toUpperCase());
        if (existType) {
          continue;
        }

        headerTypes[type] = constant[type];
      }
    }

    this._TYPES = {
      ...TYPES,
      ...headerTypes,
    };
    return this._TYPES;
  }

  public getFileFunctionConstant(path: string, file: string): any {
    if (!Object.values(this._FUNCTION_FILES) || (Object.values(this._FUNCTION_FILES) && Object.values(this._FUNCTION_FILES).length == 0)) {
      return undefined;
    }
    
    let nameConstants: any[] = [];
    for (const constat of Object.values(this._FUNCTION_FILES)) {
      if (file.toUpperCase() == constat.file.toUpperCase()) {
        nameConstants.push(constat);
      }
    }

    if (nameConstants && nameConstants.length > 0) {
      for (const constant of nameConstants) {
        if (path.toUpperCase() == constant.path.toUpperCase()) {
          return constant;
        }
      }
    }

    return undefined;
  }

  public checkIfFileFunctionExists(fileFunctionConstant: IFileFunction): boolean {
    const path: string = fileFunctionConstant.path 
      ? `${fileFunctionConstant.path}/${fileFunctionConstant.file}`
      : `${fileFunctionConstant.file}`;

    if (fs.existsSync(`${this._filesPath}/${this._filesFolder}/${path}.${this._filesExtension}`)) {
      return true;
    }

    return false;
  } 

  public checkFileFunctionsParamReported(fileFunctionConstant: IFileFunction, body: any): boolean {  
    if (!Object.keys(fileFunctionConstant).find(k => k == 'params')) {
      return true;
    }

    if (Object.values(fileFunctionConstant.params) && Object.values(fileFunctionConstant.params).length == 0) {
      return true;
    }

    for (const param of Object.values(fileFunctionConstant.params)) {
      if (body[param.name] == undefined || body[param.name] == null || body[param.name] == '') {
        
        if (param.optional == true) {
          continue;
        }

        return false;
      }
    }

    return true;
  }

  public async checkFileFunctionParamsTypes(fileFunctionConstant: IFileFunction, body: any): Promise<string> {
    if (!Object.keys(fileFunctionConstant).find(k => k == 'params')) {
      return '';
    }

    for (const param of Object.values(fileFunctionConstant.params)) {
      const paramType: string = typeof body[param.name];
      if (param.type.toUpperCase() != paramType.toUpperCase()) {

        if (body[param.name] == undefined || body[param.name] == null && param.optional == true) {
          continue;
        }

        if (param.type == 'any' || param.type == 'any[]') {
          continue;
        }

        return `parameter ${param.name} should be ${param.type} value`;
      }

      if (param.type.toUpperCase() == this._TYPES.OBJECT.toUpperCase()) {
        if (param.dto && this.options.validationPipe) {
          try {
            await this.validationPipe.transform(body[param.name], { type: 'body', metatype: param.dto });
          } catch (error) {
            const errors = Object.values(error.response.message).join(',');
            const splitErrors: string[] = errors.split(',');
            return `Parameter ${param.name} - ${splitErrors[splitErrors.length-1]}`;
          }
        }
      }
    }

    return '';
  }

  public getFileFunctionBuffer(fileFunctionConstant: IFileFunction): string {
    const path: string = fileFunctionConstant.path 
      ? `${fileFunctionConstant.path}/${fileFunctionConstant.file}`
      : `${fileFunctionConstant.file}`;

    const buffer: string = fs.readFileSync(`${this._filesPath}/${this._filesFolder}/${path}.${this._filesExtension}`, 'utf-8');
    if (!buffer || (buffer && buffer.length == 0)) {
      return undefined;
    }

    const bufferSplit: string[] = buffer.split('\n');
    if (!bufferSplit || (bufferSplit && bufferSplit.length == 0)) {
      return undefined;
    }

    let bufferFormated: string = '';
    for (const split of bufferSplit) {
      if (split.startsWith('import {')) {
        continue;
      }

      bufferFormated += `${split}\n`; 
    } 

    return bufferFormated && bufferFormated.length > 0 ? bufferFormated : undefined;
  }

  public convertBufferToFunction(buffer: string): any {
    const code: string = `(${buffer})`;
    const result: string = ts.transpile(code);
    const runnalbe: any = eval(result);
    return runnalbe ? runnalbe : undefined;
  }
}
