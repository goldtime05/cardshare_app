import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { NavController, Events } from '@ionic/angular';

@Component({
  selector: 'app-paypal',
  templateUrl: './paypal.page.html',
  styleUrls: ['./paypal.page.scss'],
})
export class PaypalPage implements OnInit {

  receiveUser: any;
  emailInfo: any;
  userName: any

  constructor(
    public r:Router, private navCtrl: NavController, private event: Events
    ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.receiveUser = JSON.parse(localStorage.getItem("receiver_info"));
    console.log(this.receiveUser);
    if (this.receiveUser) {
      console.log(this.receiveUser.receive_phone);
      this.emailInfo = this.receiveUser.receive_phone;
      this.userName = this.receiveUser.first_name + " " + this.receiveUser.last_name;
    } else {
      this.emailInfo = localStorage.getItem("receiver_phone");
    }
  }

  goBackHome() {
    this.navCtrl.navigateRoot('main');
    this.event.publish('goback-home');
  }
}
