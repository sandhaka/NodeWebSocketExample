import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {SysService} from "./sys.service";
import {WebSocketService} from "./websocket.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxChartsModule,
  ],
  providers: [SysService, WebSocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
