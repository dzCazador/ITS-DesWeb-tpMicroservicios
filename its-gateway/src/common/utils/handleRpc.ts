import { catchError, lastValueFrom } from "rxjs";
import { RpcResponse } from "../models/rpc.model";
import { HttpException } from "@nestjs/common";


function handleRpcError() {
  return catchError((rpcError: RpcResponse) => {
    const { statusCode = 500, error } = rpcError;
    throw new HttpException(error ?? rpcError, statusCode);
  });
}