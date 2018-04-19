import { Injectable } from '@angular/core';
import {WebSocketService} from "./websocket.service";
import {Subject} from "rxjs/Subject";
import {Message} from "common/lib";

@Injectable()
export class SysService {

  public sysData$: Subject<Message>;

  constructor(private webSocketService: WebSocketService) {
    this.sysData$ = <Subject<Message>>this.webSocketService
      .connect("ws://localhost:8999")
      .map((response: MessageEvent): Object => {
        return response.data;
    });
  }

  send(contentType: string, message: string) {
    this.sysData$.next(new Message(contentType, message));
  }
}
