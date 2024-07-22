import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservationService } from '../reservation/reservation.service';
import { Reservation } from '../models/reservation';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reservation-form',
  templateUrl: './reservation-form.component.html',
  styleUrls: ['./reservation-form.component.css']
})
export class ReservationFormComponent implements OnInit {

  reservationForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private ReservationService: ReservationService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    
  }

  ngOnInit(): void {
    this.reservationForm = this.formBuilder.group({
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      guestName: ['', Validators.required],
      guestEmail: ['', [Validators.required, Validators.email]],
      roomNumber: ['', Validators.required]
    })

    let id = this.activatedRoute.snapshot.paramMap.get('id');

    if(id) {
      this.ReservationService.getReservation(id).subscribe(reservation => {
        if(reservation)
        this.reservationForm.patchValue(reservation);
      });

      
    }
  }


  onSubmit() {
    if(this.reservationForm.valid) {

      let reservation: Reservation = this.reservationForm.value;
      let id = this.activatedRoute.snapshot.paramMap.get('id');

      if(id) {
        //update
        this.ReservationService.updateReservation(id, reservation).subscribe(() => {
          console.log("Update request sent.");
        })
      } else {
        //create new reservation
        this.ReservationService.addReservation(reservation).subscribe(() => {
          console.log("Reservation request sent.");
        })
      }

      this.router.navigate(['/list']);
    }
  }

}
