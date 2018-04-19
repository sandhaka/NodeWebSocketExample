import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import { Chart } from 'chart.js';
import {SysService} from "./sys.service";
import {Message} from "common/lib";
import * as shape from 'd3-shape';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {

  memData: any[] = [
    {
      name: "Memory used in KByte",
      series: [  ]
    }
  ];

  cpuData: any[] = [
    {
      name: "user",
      series: []
    },
    {
      name: "sys",
      series: []
    },
    {
      name: "idle",
      series: []
    }
  ];

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

  private isHidden: boolean = false;

  constructor(private sysService: SysService, private cd: ChangeDetectorRef) {  }

  ngOnInit() {

    /**
     * That's a workaround for Google Chrome browser resources throttle feature for the hidden (not active) pages
     * It cause problems in web sockets communication for the real-time data that continuously arrived to the web app
     * When the user come back to the page the application have to manage a series of
     * registered events that freeze the application.
     *
     * Listening for a visibility change event and set a flag
     */
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          console.log("document is hidden");
          this.isHidden = true;
        } else {
          console.log("document is showing");
          this.isHidden = false;
        }
      }
    );

    /**
     * Subscription to the system service
     */
    this.sysService.sysData$.subscribe((data: any) => {

      const payload = <Message>JSON.parse(data);

      // If the packet is not a data one discard it
      if(payload.contentType !== 'data')
        return;

      const time = new Date(payload.time);

      // Memory series
      this.memData[0].series.push(
        {
          name: time,
          value: payload.content.mem / 1000
        }
      );

      // Limit to 600 points (~ 10 minutes)
      if(this.memData[0].series.length > 600)
        this.memData[0].series.splice(0,1);

      // Cpu series
      for(const type in payload.content.cpus) {

        let dataSet = this.cpuData.find(d => d.name === type);

        dataSet.series.push(
          {
            name: time,
            value: +payload.content.cpus[type]
          }
        );

        // Limit to 600 points (~ 10 minutes)
        if(dataSet.series.length > 600)
          dataSet.series.splice(0,1);

      }

      // Call the Angular change detection only if the application page is showing
      if(!this.isHidden) {

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
