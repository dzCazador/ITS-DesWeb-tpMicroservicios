import { catchError, lastValueFrom, Observable } from "rxjs";
import { RpcResponse } from "../model/rpc.model";
import { HttpException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";


  /**
   * Envía una solicitud a un microservicio específico y maneja los errores de forma centralizada.
   * @param client El cliente del microservicio (ej. this.invoiceClient).
   * @param pattern El patrón del microservicio.
   * @param data Los datos a enviar.
   * @returns Un Observable con la respuesta del microservicio.
   */
  export async function  sendToMicroservice<T>(client: ClientProxy, pattern: any, data: T) {
     return await lastValueFrom(
      client.send(pattern, data).pipe(
      catchError((rpcError: RpcResponse) => {
        const { statusCode = 500, error } = rpcError;
        throw new HttpException(error ?? rpcError, statusCode);
      }),
    )
    )
  }