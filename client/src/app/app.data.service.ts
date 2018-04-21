import {Injectable} from "@angular/core";
import {Message} from "../../../common/lib";

@Injectable()
export class AppDataService {

  public memoryData: any = [
    {
      name: "Memory used in KByte",
      series: [  ]
    }
  ];

  public cpuData: any = [
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

  manageIncomingData(data: any) {

    const payload = <Message>JSON.parse(data);

    // If the packet is not a data one discard it
    if(payload.contentType !== 'data')
      return;

    const time = new Date(payload.time);

    // Memory series
    this.memoryData[0].series.push(
      {
        name: time,
        value: payload.content.mem / 1000
      }
    );

    // Limit to 600 points (~ 10 minutes)
    if(this.memoryData[0].series.length > 600)
      this.memoryData[0].series.splice(0,1);

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

  }

}
