import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { FlightInfoPayload } from 'src/app/models/FlightInfoPayload';
import { FlightService } from 'src/app/services/flight.service';

@Component({
  selector: 'app-add-flight',
  templateUrl: './add-flight.component.html',
  styleUrls: ['./add-flight.component.scss']
})
export class AddFlightComponent implements OnInit {
  displayModal: boolean = false;
  flight: FlightInfoPayload;
  flags: any = {
    airline: true, arrivalDate: true, arrivalTime: true,
    flightNumber: true, numOfGuests: true, submitBtn: false
  }

  constructor(
    private appTitle: Title,
    private flightSvc: FlightService,
    private toastr: ToastrService
  ) {
    this.appTitle.setTitle('Flight Info - Add Flight Details');
    this.flight = {
      airline:'', arrivalDate: '', arrivalTime: '',
      flightNumber: '', numOfGuests: 0, comments: ''
    };
  }

  ngOnInit(): void {
  }

  handleFormSubmit(): void {
    this.displayModal = true;

    this.flightSvc.addFlight(this.flight)
    .subscribe((result) => {
      if(result.status === 200 && result.ok === true) {
        this.toastr.success('Flight info is posted!', 'Inform');
        this.flight = {
          airline:'', arrivalDate: '', arrivalTime: '',
          flightNumber: '', numOfGuests: 0, comments: ''
        };
      } else this.toastr.error('Something went wrong!', 'Error');

      this.displayModal = false;
    },
    (error) => {
      this.toastr.error('Something went wrong!', 'Error');
      this.displayModal = false;
    });
  }
  validateString(el: HTMLInputElement, name: string): void {
    let flag = /^[a-zA-Z0-9]+$/.test(el.value);
    this.flags[name] = flag;
  }
  validateNumber(el: HTMLInputElement, name: string): void {
    let flag = /^[0-9]+$/.test(el.value);
    if(el.value === '0') flag = false;
    this.flags[name] = flag;
  }
  validateDate(el: HTMLInputElement):void {

    let curYear = new Date().getFullYear() + 1;
    //current: yyyy-MM-DD
    let date = el.value;
    let tmp = date.split('-');
    if(tmp.length == 3) {
      if(tmp[0].length > 4 || tmp[0] > curYear.toString()) {
        this.flags.arrivalDate = false;
      } else {
        this.flags.arrivalDate = true;
      }
    } else {
      this.flags.arrivalDate = false;
    }
  }
  validateTime(el: HTMLInputElement):void {

    //hh:mm
    if(!el.value) {
      this.flags.arrivalTime = false;
    } else this.flags.arrivalTime = true;
  }
  enableSubmitBtn():void {
    this.flags.submitBtn = this.flags.airline && this.flags.arrivalDate
                        && this.flags.arrivalTime && this.flags.flightNumber
                        && this.flags.numOfGuests;
    if(this.flags.submitBtn)
      console.log('obj', this.flight);
  }
}
