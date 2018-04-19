export class Message {
    constructor(
        public contentType: string,
        public content: any,
        public time: number = Date.now()
    ) {
    }
}