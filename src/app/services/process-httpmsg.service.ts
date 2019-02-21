import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessHTTPMsgService {

  constructor() { }

  public handleError(error: HttpErrorResponse | any) {
    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {
      // Cualquier otro tipo de error
      errorMessage = error.error.message;
    } else {
      // Error Http
      errorMessage = `${error.status} - ${error.statusText || ''} - ${error.error}`;
    }

    return throwError(errorMessage);
  }

}
