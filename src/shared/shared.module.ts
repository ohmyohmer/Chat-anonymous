import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DateFormatPipe} from './pipe/date-format.pipe';
import {DateTimeFormatPipe} from './pipe/date-time-format';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DateFormatPipe,
    DateTimeFormatPipe
  ],
  providers: [ ]
})
export class SharedModule { }
