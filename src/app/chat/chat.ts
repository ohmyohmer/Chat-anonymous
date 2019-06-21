import {DateTimeFormatPipe} from "../../shared/pipe/date-time-format";

//Chat class
export class Chat {
  user: string;
  timestamp: string;
  message: string;
  image: string;

  constructor(user: string, timestamp: Date, message: string, image: string) {
    this.user = user;
    this.timestamp = new DateTimeFormatPipe('en-US').transform(timestamp);
    this.message = message;
    this.image = image;
  }
}


