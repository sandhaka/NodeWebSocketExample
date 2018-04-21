import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {SysService} from "./sys.service";
import * as shape from 'd3-shape';
import {AppDataService} from "./app.data.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {

  memColorScheme = {
    domain: ['#BBBBBB', '#000FFF', '#AAAAAA', '#CCCCCC']
  };

  cpuColorScheme = {
    domain: ['#5AA454', '#A10A28', '#FFFCCC', '#BBBFF0', '#DD00CC']
  };

  commonChart = {
    enableGradient: false,
    showXAxis: true,
    showYAxis: true,
    showLegend: true,
    showXAxisLabel: false,
    showYAxisLabel: true,
    autoScale: true,
    animations: true,
    curve: shape.curveBasis
  };

  // Bind to data service
  memData = this.appDataService.memoryData;
  cpuData = this.appDataService.cpuData;

  constructor(private sysService: SysService, private appDataService: AppDataService, private cd: ChangeDetectorRef) {  }

  ngOnInit() {

    /**
     * Subscription to the system service
     */
    this.sysService.sysData$.subscribe((data: any) => {

      this.appDataService.manageIncomingData(data);

      /**
       * That's a workaround for Google Chrome browser resources throttle feature for the hidden (not active) pages.
       * It cause problems to web sockets communication for the real-time data that continuously arrived to the web app
       * When the user come back to the page the application have to manage a series of
       * registered events, application is hangup.
       *
       * Use that flag to conditionally execute the angular change detection system.
       */
      if(!document.hidden) {

        this.memData = [...this.memData];
        this.cpuData = [...this.cpuData];

        this.cd.markForCheck();

      }

    });
  }

  ngOnDestroy() {
    this.sysService.sysData$.unsubscribe();
  }
}
