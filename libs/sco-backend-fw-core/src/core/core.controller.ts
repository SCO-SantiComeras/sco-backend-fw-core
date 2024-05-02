import { Body, Controller, HttpException, Inject, Param, Post, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { IFileFunction } from './interfaces/ifile-function.interface';
import { IFileFunctionResponse } from './interfaces/ifile-function-response.interface';
import { CoreService } from './core.service';
import { CoreConfig } from './config/core.config';
import { HTTP_ERRORS } from './http-errors/http-errors.constants';
import { HTTP_STATUS } from './http-errors/http-status.constants';
import { TYPES } from './types/types.constants';

@Controller('api/v1')
export class CoreController {

  private _FUNCTION_FILES: IFileFunction[];
  private _TYPES = TYPES;

  constructor(
    @Inject('CONFIG_OPTIONS') private options: CoreConfig,
    private readonly coreService: CoreService,
  ) {}

  @Post(':path/:file')
  async executeFile(
    @Req() req: Request, 
    @Res() res: Response, 
    @Param('path') path: string,
    @Param('file') file: string,
    @Body() body: any,
  ): Promise<Response<any | IFileFunctionResponse, Record<string, any | IFileFunctionResponse>>> {

    /* Validation Passport */
    if (this.options.validationPassport) {
      const validationPassport: any = req.headers.validationPassport;
      if (!validationPassport) {
        console.log(`[GlobalApi] ${HTTP_ERRORS.APP.VALIDATION_PASSPORT_CALLBACK_NOT_PROVIDED}`);
        throw new HttpException(HTTP_ERRORS.APP.VALIDATION_PASSPORT_CALLBACK_NOT_PROVIDED, HTTP_STATUS.INTERNAL_SERVER_ERROR);
      }

      if (!await validationPassport(req.headers.authorization)) {
        console.log(`[GlobalApi] Validation passport unauthorized`);
        throw new HttpException(HTTP_ERRORS.APP.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
      }
    }

    /* Initial Data */
    this.options.verbose ? console.log(`[GlobalApi] Start function: ${path}/${file}`) : undefined;
    if (Object.values(body) && Object.values(body).length > 0) {
      this.options.verbose ? console.log(`[GlobalApi] body: ${JSON.stringify(body)}`) : undefined;
    }
    
    /* Check If Path Function Param Is Reported */
    if (!path) {
      console.log(`[GlobalApi] File function path not provided`);
      throw new HttpException(HTTP_ERRORS.CONTROLLER.FILE_FUNCTION_PATH_NOT_PROVIDED, HTTP_STATUS.PAYMENT_REQUIRED);
    }

    /* Check If File Function Param Is Reported */
    if (!file) {
      console.log(`[GlobalApi] File function not provided`);
      throw new HttpException(HTTP_ERRORS.CONTROLLER.FILE_FUNCTION_NOT_PROVIDED, HTTP_STATUS.PAYMENT_REQUIRED);
    }

    /* Check If Function Files Header Is Provided */
    this._FUNCTION_FILES = this.coreService.setFunctionFilesConstantsHeader(req.headers.FUNCTION_FILES);
    if (!this._FUNCTION_FILES || (this._FUNCTION_FILES && this._FUNCTION_FILES.length == 0)) {
      console.log(`[GlobalApi] File function '${path}/${file}' constants header not provided`);
      throw new HttpException(HTTP_ERRORS.APP.FILE_FUNCTIONS_HEADER_NOT_PROVIDED, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    /* Check If Providers Header Is Provided */
    const providers: any = req && req.headers && req.headers.providers ? req.headers.providers : undefined;
    if (providers == undefined) {
      console.log(`[GlobalApi] File function '${path}/${file}' providers header not provided`);
      throw new HttpException(HTTP_ERRORS.APP.PROVIDERS_HEADER_NOT_PROVIDED, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    /* Format Types */
    this._TYPES = this.coreService.setTypes(req.headers.types);
    if (!this._TYPES) {
      console.log(`[GlobalApi] File function '${path}/${file}' types header not provided`);
      throw new HttpException(HTTP_ERRORS.APP.TYPES_HEADER_NOT_PROVIDED, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    /* Found File Function Constant */
    const fileFunctionConstant: IFileFunction = this.coreService.getFileFunctionConstant(path, file);
    if (!fileFunctionConstant) {
      console.log(`[GlobalApi] File function '${path}/${file}' constants not found`);
      throw new HttpException(HTTP_ERRORS.CONTROLLER.FILE_FUNCTION_CONSTANTS_NOT_FOUND, HTTP_STATUS.NOT_FOUND);
    }

    /* Check If File Function exists */
    if (!this.coreService.checkIfFileFunctionExists(fileFunctionConstant)) {
      console.log(`[GlobalApi] File function '${path}/${file}' not exists`);
      throw new HttpException(HTTP_ERRORS.CONTROLLER.FILE_FUNCTION_NOT_EXISTS, HTTP_STATUS.NOT_FOUND);
    }

    /* Check If Function File Params Are Reported */
    const paramsReported: boolean = this.coreService.checkFileFunctionsParamReported(fileFunctionConstant, body);
    if (!paramsReported) {
      console.log(`[GlobalApi] File function '${path}/${file}' params not provided`);
      throw new HttpException(HTTP_ERRORS.CONTROLLER.FILE_FUNCTION_PARAMS_NOT_PROVIDED, HTTP_STATUS.PAYMENT_REQUIRED);
    }

    /* Check if function file params types are valid */
    const paramError: string = await this.coreService.checkFileFunctionParamsTypes(fileFunctionConstant, body);
    if (paramError) {
      console.log(`[GlobalApi] File function '${path}/${file}' ${paramError}`);
      throw new HttpException(`${paramError[0].toUpperCase()}${paramError.substring(1, paramError.length)}`, HTTP_STATUS.BAD_REQUEST);
    }

    /* Convert file to TS/JS ussable code */
    const buffer: string = this.coreService.getFileFunctionBuffer(fileFunctionConstant);
    if (!buffer) {
      console.log(`[GlobalApi] File function '${path}/${file}' unnable to convert file to buffer`);
      throw new HttpException(HTTP_ERRORS.CONTROLLER.FILE_FUNCTION_UNNABLE_CONVERT_BUFFER, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    /* Parse ussable code to variable */
    const funct: any = this.coreService.convertBufferToFunction(buffer);
    if (!funct) {
      console.log(`[GlobalApi] File function '${path}/${file}' unnable to convert buffer to function`);
      throw new HttpException(HTTP_ERRORS.CONTROLLER.FILE_FUNCTION_UNNABLE_CONVERT_FUNCTION, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }

    /* Get Result from variable function */
    const result: any = await funct(body, providers);
    let typeOf: string = typeof result;

    if (result && result.type && result.type == 'HttpException') {
      throw new HttpException(result.message, result.code);
    }

    if (typeOf.toUpperCase() == this._TYPES.OBJECT.toUpperCase()) {
      typeOf = result.constructor.name;
    }

    /* Check if result type if the same that functino file result */
    if (typeOf.toUpperCase() != fileFunctionConstant.resultType.toUpperCase()) {
      console.log(`[GlobalApi] File function '${path}/${file}' result type (${fileFunctionConstant.resultType}) not match resulty type (${typeOf})`);
      throw new HttpException(HTTP_ERRORS.CONTROLLER.FILE_FUNCTION_RESULT_NOT_MATCH, HTTP_STATUS.CONFLICT);
    }

    this.options.verbose ? console.log(`[GlobalApi] Result of function '${path}/${file}': ${result}`) : undefined;

    /* Return result if response is not required */
    if (!this.options.response) {
      return res.status(200).json(result);
    }
    
    /* Return response */
    const response: IFileFunctionResponse = {
      file: fileFunctionConstant.file,
      path: fileFunctionConstant.path ? fileFunctionConstant.path : undefined,
      params: fileFunctionConstant.params ? fileFunctionConstant.params : undefined,
      resultType: typeOf,
      result: result,
      success: true,
    };

    this.options.verbose ? console.log(`[GlobalApi] Response: ${JSON.stringify(response)}`) : undefined;
    return res.status(200).json(response);
  }
}
