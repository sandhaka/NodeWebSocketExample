import {AppDataService} from "./app.data.service";

let service: AppDataService;

beforeEach(() => {
  service = new AppDataService();
});

it('Should manage the new incoming data and arrange these correctly', () => {
  // setup
  const data = {
    "contentType" : "data",
    "content":
      {
        "mem" : 9006944256,
        "cpus" :
          {
            "user" : 12,
            "sys" : 5,
            "idle" : 83
          }
      },
    "time":1524320214029
  };

  // act
  service.manageIncomingData(JSON.stringify(data));

  // verify
  expect(service.cpuData[0].series.length).toBe(1, "Expected length 1");
  expect(service.cpuData[1].series.length).toBe(1, "Expected length 1");
  expect(service.cpuData[2].series.length).toBe(1, "Expected length 1");
  expect(service.memoryData[0].series.length).toBe(1, "Expected length 1");
  expect(service.memoryData[0].series[0].value)
    .toBe(9006944256 / 1000, "Expected to be 9006944256 / 1000");
  expect(service.cpuData[0].series[0].value).toBe(12, "Expected to be 12");
});
