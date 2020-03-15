import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { LoadingController, AlertController, NavController, PopoverController, Events, ModalController } from '@ionic/angular';
import { CountryCodePage } from '../country-code/country-code.page';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  isZoomed: boolean = true;
  loginId: boolean = false;
  signupId: boolean = false;
  deviceUid: any;

  email: any;
  password: any;

  fname: any;
  lname: any;
  semail: any;
  phone: string;
  regionCode: any;
  counrty: any;
  spassword: any;
  cpassword: any;


  constructor(
    public api: ApiService, public loadingController: LoadingController, public r: Router, public alertController: AlertController,
    private navCtrl: NavController, private popoverCtrl: PopoverController, private event: Events, private modalCtrl: ModalController
  ) {
    event.subscribe(this.api.selectCountryCodeEvent, () => {
      this.DismissClick();
    })
    event.subscribe(this.api.noSelectContactEvent, () => {
      this.closeModal();
    })
   }

  ngOnInit() {
    this.email = "";
    this.password = "";
    this.fname = "";
    this.lname = "";
    this.semail = "";
    this.phone = "";
    this.regionCode = "";
    this.counrty = "";
    this.spassword = "";
    this.cpassword = "";
  }

  ionViewDidEnter() {
    // this.getDeveiceInfo()
  }

  async showCountryCode(ev) {
    const popover = await this.modalCtrl.create({
      component: CountryCodePage,
      showBackdrop: true,
    });
    return await popover.present();
  }

  async DismissClick() {
    if (this.api.countryCode.includes(" ")) {
      var ss = this.api.countryCode.split(" ");
      this.regionCode = ss[0] + ss[1]      
    } else this.regionCode = this.api.countryCode;

    await this.modalCtrl.dismiss();
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }

  goto(p) {
    // this.r.navigateByUrl(p);
    this.isZoomed = true
  }

  gotoForgot() {
    this.navCtrl.navigateForward('forgot')
  }

  checkPage(id) {
    if (id === 'login') {
      this.loginId = true;
      this.signupId = false;
    } else {
      this.loginId = false;
      this.signupId = true;
    }
  }

  getDeveiceInfo() {
    // this.deviceUid = localStorage.getItem("deviceId");
    this.deviceUid = this.api.deviceID;
    console.log("deviceid ---------  : ", this.deviceUid);
    this.login();

    // this.uniqueDeviceID.get()
    // .then((uuid: any) => {
    //   this.deviceUid = uuid
    //   this.deviceUid = localStorage.getItem("deviceId");
    //   console.log("=== uuid ==: ", uuid)
    //   console.log("localstoreage deviceid = : ", localStorage.getItem("deviceId"));
    //   this.login();
    // })
    // .catch((error: any) => console.log(error));
  }

  async login() {

    if (!this.email || this.email == "") {
      alert("Please enter your username.")
      return;
    } else if (!this.password || this.password == "") {
      alert("Please enter your password.")
      return;
    }

    var data = {
      'email': this.email,
      'password': this.password,
      'uuid': this.deviceUid
    };

    this.api.presentLoading();
    this.api.login(data).subscribe(res => {
      console.log("========== response ==========: ", res)
      this.api.hideLoading()
      if (res.status == '0') {
        this.api.presentAlert(res.result);
      } if (res.status == '1') {
        localStorage.setItem('user', JSON.stringify(res.result));
        this.navCtrl.navigateRoot('/main');
      }
    }, err => {
      this.api.hideLoading()
      this.api.presentAlert('Network connection error');
    });
  }

  registerData() {

    if (!this.fname || this.fname == "") {
      this.api.presentToast("Please input your first name.")
      return;
    } else if (!this.lname || this.lname == "") {
      this.api.presentToast("Please input your last name.")
      return;
    } else if (!this.semail || this.semail == "") {
      this.api.presentToast("Please input your email address.")
      return;
    } else if (!this.spassword || this.spassword == "") {
      this.api.presentToast("Please input your password.")
      return;
    } else if (this.spassword != this.cpassword) {
      this.api.presentToast("Password is not correct.")
      return;
    } else if (!this.regionCode || this.regionCode == "") {
      this.api.presentToast("Pleasse input the region code.")
      return;
    } else if (!this.phone || this.phone == "") {
      this.api.presentToast("Please input your phone number.")
      return;
    }

    this.api.presentLoading();

    var pph = "" + this.phone
    if (pph.substring(0, 1) == "0") {
      this.phone = pph.substring(1, pph.length)
    } else this.phone = pph

    console.log(pph);

    var mobile = this.regionCode + this.phone

    let data = {
      email: this.semail,
      password: this.spassword,
      dob: '2000-01-01',
      first_name: this.fname,
      last_name: this.lname,
      mobile: mobile,
      gender: 'male'
    }

    this.api.withoutImgsign(data).subscribe((resp) => {
      this.api.hideLoading();
      console.log("===  signup response  === : ", resp);
      if (resp.status == "0") {
        alert(resp.result);
      } else if (resp.status == "1") {
        this.api.presentToast("Registered successfully. Please login now.")
        this.loginId = true;
        this.signupId = false;
      }
    })
  }

  async presentAlert(msg) {
    const alert = await this.alertController.create({
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }
}

