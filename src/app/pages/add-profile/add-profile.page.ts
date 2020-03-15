import { Component, OnInit } from '@angular/core';
declare var Stripe;
import { HttpClient } from "@angular/common/http";
import { ApiService } from 'src/app/services/api.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-profile',
  templateUrl: './add-profile.page.html',
  styleUrls: ['./add-profile.page.scss'],
})
export class AddProfilePage implements OnInit {

  // stripe = Stripe(this.service.stripePubKey);
  // card: any;
  videoUrl: any;
  
  constructor(
    private service: ApiService,
    private navCtrl: NavController,
    private route: ActivatedRoute, private router: Router
  ) {
    this.route.queryParams.subscribe(param => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.videoUrl = this.router.getCurrentNavigation().extras.state.value;
      }
    })
  }

  ngOnInit() {
    // this.setupStripe();
  }

  goBack() {
    this.navCtrl.pop()
  }

  // setupStripe() {
  //   let elements = this.stripe.elements();
  //   var style = {
  //     base: {
  //       color: '#32325d',
  //       lineHeight: '24px',
  //       fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
  //       fontSmoothing: 'antialiased',
  //       fontSize: '16px',
  //       '::placeholder': {
  //         color: '#aab7c4'
  //       }
  //     },
  //     invalid: {
  //       color: '#fa755a',
  //       iconColor: '#fa755a'
  //     }
  //   };

  //   this.card = elements.create('card', { style: style });
  //   console.log(this.card);
  //   this.card.mount('#card-element');

  //   this.card.addEventListener('change', event => {
  //     var displayError = document.getElementById('card-errors');
  //     if (event.error) {
  //       displayError.textContent = event.error.message;
  //     } else {
  //       displayError.textContent = '';
  //     }
  //   });

  //   var form = document.getElementById('payment-form');
  //   form.addEventListener('submit', event => {
  //     event.preventDefault();
  //     console.log(event)

  //     this.stripe.createSource(this.card).then(result => {
  //       if (result.error) {
  //         var errorElement = document.getElementById('card-errors');
  //         errorElement.textContent = result.error.message;
  //       } else {
  //         console.log("-- stripe result --", result);
  //         this.makePayment(result.id);
  //       }
  //     });
  //   });
  // }

  // makePayment(token) {
  //   this.http.post('https://us-central1-cardshare-8df2d.cloudfunctions.net/payWithStripe', {
  //     amount: 100,
  //     currency: "usd",
  //     token: token.id
  //   }).subscribe(data => {
  //       console.log(data);
  //     });
  // }

}
