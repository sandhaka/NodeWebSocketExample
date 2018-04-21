import {SysService} from "./sys.service";
import * as Rx from "rxjs/Rx";

let service: SysService;
let webSocketServiceSpy: {
  connect: jasmine.Spy
};

beforeEach(() => {
  webSocketServiceSpy = jasmine.createSpyObj('WebSocketService', ['connect']);
});

it('Should connect to web socket service', () => {
  // setup
  webSocketServiceSpy.connect.and.returnValue({ map: (): Rx.Subject<MessageEvent> => {
    return new Rx.Subject<MessageEvent>()
  }});

  // act
  service = new SysService(<any>webSocketServiceSpy);

  service.send('test', 'test');

  // verify
  expect(webSocketServiceSpy.connect.calls.count()).toBe(1, 'Expected 1 call');
});
