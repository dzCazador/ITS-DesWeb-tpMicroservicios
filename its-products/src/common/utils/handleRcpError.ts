import { RpcException } from "@nestjs/microservices";
import { RpcResponse } from "../model/rpc.model";

export function  handleRpcError(error: any) {
    if (error instanceof RpcException) {
      throw error;
    }
    const message = error?.message || 'Unexpected error';
    const statusCode = error?.statusCode || 500;
    throw new RpcException({
      error: message,
      statusCode,
    } as RpcResponse);
  }