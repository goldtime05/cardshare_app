import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Stripe } from '@ionic-native/stripe/ngx';
import { ApiService } from '../../services/api.service';
declare var cordova: any;
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { AlertController, PopoverController, Events, NavController, IonSlides } from '@ionic/angular';
import { PaypalPage } from '../paypal/paypal.page';
import { PayPal, PayPalPayment, PayPalConfiguration, PayPalPaymentDetails } from '@ionic-native/paypal/ngx';
import { HttpClient } from "@angular/common/http";
import { error } from 'util';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {

  @ViewChild('slides', { static: true }) slider: IonSlides;

  card: any;
  cardDetails: any = {};
  data: any = {};
  cardData: any = {}
  userData: any = {}
  mmyy: any;
  card_number: any;
  videoFileUpload: FileTransferObject;
  cvv: any;
  imag1Obj: any = '';
  imag2Obj: any = '';
  videoObj: any = {};
  cardHolderName: any;
  firstResObj: any = {};
  id: any;
  checkg: any = false;
  segment: any = "0";

  phone_number: any;
  receiver_id: any;

  alert;

  public cardform: FormGroup;
  public paypalForm: FormGroup;

  constructor(
    public fileTransfer: FileTransfer, public r: Router, private http: HttpClient, public service: ApiService,
    private alertCtrl: AlertController, private popCtrl: PopoverController, private event: Events,
    private navCtrl: NavController,
    private stripe: Stripe,
    private payPal: PayPal,
    public alertController: AlertController,
    public formBuilder: FormBuilder,
  ) {
    this.event.subscribe('goback-home', () => {
      this.dismissAlert();
    });

    this.segment = "0";

    //this.checkValid()
    this.cardform = this.formBuilder.group({      
      cardHolderName: [''],
      card_number: [''],
      mmyy: [''],
      cvv: [''],
    });

    this.paypalForm = this.formBuilder.group({      
      email: ['', Validators.compose([Validators.required, Validators.pattern('^[A-Z0-9a-z._%+-]+@([A-Za-z0-9-]+.)+[A-Za-z]{2,4}$')])],
    });
    
  }

  checkValid() {
    this.cardform = this.formBuilder.group({
      // email: ['', Validators.compose([Validators.required, Validators.pattern('^[A-Z0-9a-z._%+-]+@([A-Za-z0-9-]+.)+[A-Za-z]{2,4}$')])],
      cardHolderName: [this.cardHolderName, Validators.compose([Validators.required])],
      card_number: [this.card_number, Validators.compose([Validators.required, Validators.maxLength(16)])],
      mmyy: [this.mmyy, Validators.compose([Validators.required])],
      cvv: [this.cvv, Validators.compose([Validators.required, Validators.maxLength(4)])],
    });
  }

  ngOnInit() {
    // this.setupStripe(); 
  }

  ionViewWillEnter() {
    this.data = JSON.parse(localStorage.getItem('data'));
    this.imag1Obj = this.data.image1;
    this.imag2Obj = this.data.image2;

    this.cardData = JSON.parse(localStorage.getItem("card_detail"));

    this.userData = JSON.parse(localStorage.getItem("user"));
  }

  ionViewDidEnter() {
    var receiverData = JSON.parse(localStorage.getItem("receiver_info"));
    console.log("receiver_info === : ", receiverData);
    if (receiverData) {
      this.phone_number = receiverData.mobile;
      this.receiver_id = receiverData.id;
    } else {
      this.phone_number = localStorage.getItem("receive_phone");
      this.receiver_id = 0
    }
  }

  async segmentChanged() {
    this.segment
    await this.slider.slideTo(this.segment);
  }

  async slideChanged() {
    this.segment = await this.slider.getActiveIndex();
  }
  

  goto(p) {
    this.navCtrl.pop();
  }

  PayNow() {

    if (!this.checkCardNumber(this.card_number) || !this.checkCvvNumber(this.cvv)) {
      return;
    }

    this.stripe.setPublishableKey(this.service.stripePubKey);
    
    var expire_date = this.mmyy.split("/");
    var expMonth = expire_date['0'];
    var expYear = expire_date['1'];
    
    this.cardDetails = {
      number: this.card_number,
      expMonth: expMonth,
      expYear: expYear,
      cvc: this.cvv
    }

    this.service.presentLoading();    

    this.stripe.createCardToken(this.cardDetails)
      .then(token => {
        console.log("stripe token",token);
        this.makePayment(token.id);
      })
      .catch(error => {
        console.error(error);
        this.service.hideLoading();
      });    
  }

  makePayment(token) {    
    console.log("=== this.data.total_amt === : ", this.data.total_amt);
    var formData = {
      'token': token,
      'email' : this.userData.email,
      'user_id' : this.userData.id,
      'amount': this.data.total_amt,
      'card_number': this.cardDetails.number,
      'sender_id': this.userData.id,
      'receiver_id': this.receiver_id,  
      'card_id': this.cardData.id,
    }
    
    this.service.stripePayment(formData).subscribe(res =>{
        console.log("payment-status", res)
        // this.service.presentToast(JSON.stringify(res));
        this.callCredit();
    }, error =>{
      this.service.hideLoading();
      console.log("payment-error", error);
      this.presentAlert("stripe error ", JSON.stringify(error));
    })

  }

  callCredit() {
    
    var obj = {
      'sender_id': this.userData.id,
      'receiver_id': this.receiver_id,
      'message': this.data.message ? this.data.message : "",
      'gift_amount': this.data.gift ? this.data.gift : "0",
      'sender_email': this.userData.email,
      'receiver_email': this.phone_number,
      'card_id': this.cardData.id,
      'video': this.data.video ? this.data.video : "",
      'image1': this.imag1Obj ? this.imag1Obj : "",
      'image2': this.imag2Obj ? this.imag2Obj : "",
      'first_name': this.userData.first_name,
      'last_name': this.userData.last_name
    };
    console.log("send data === : ", obj);
    this.service.sendCard(obj).subscribe(res => {
      this.service.hideLoading()
      console.log("===  payment success  === : ", res);
      this.firstResObj = res.result;
      this.id = this.firstResObj.id;
      this.showAlert()
    }, err => {
      this.service.hideLoading()
      this.presentAlert("payment error ", JSON.stringify(err));
      console.log("===  payment error  === : ", err);
    })
  }

  callPayPal() {
    this.service.presentLoading();
    this.payPal.init({
      PayPalEnvironmentProduction: 'AURyyIsBS78iKy5FjqZ3meZyXKGgdZZBoXb2hATuQt__rdU__MSAwhOuhJhBx1s1uSi8kS6UaphRmvxk',
      PayPalEnvironmentSandbox: 'ARa8fqojZlPzeDFm1Pe9v4RX0dFwmj5VHLpY2FtOYp32AF-QE4Hj77QOs0u8v3dUiH7mYxsl_nM_cfCd'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentProduction', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let paymentDetails = new PayPalPaymentDetails(this.data.total_amt + ".00", '0.00', '0.00');
        let payment = new PayPalPayment(this.data.total_amt + ".00", 'AUD', 'GALA APP - Gift', 'buy', paymentDetails);
        this.payPal.renderSinglePaymentUI(payment).then(res => {
          // Successfully paid
    
          // Example sandbox response
          //
          // {
          //   "client": {
          //     "environment": "sandbox",
          //     "product_name": "PayPal iOS SDK",
          //     "paypal_sdk_version": "2.16.0",
          //     "platform": "iOS"
          //   },
          //   "response_type": "payment",
          //   "response": {
          //     "id": "PAY-1AB23456CD789012EF34GHIJ",
          //     "state": "approved",
          //     "create_time": "2016-10-03T13:33:33Z",
          //     "intent": "sale"
          //   }
          // }          

          let save_data = {
            "transaction_id" : res.response.id,
            "payment_state": res.response.state,
            "response_type": res.response_type,
            "amount": this.data.total_amt,
            "user_id": this.userData.id,
            'email' : this.paypalForm.value.email,//this.userData.email,
            'date' : res.response.create_time,
            'description' : res.response.intent,
            'sender_id': this.userData.id,
            'receiver_id': this.receiver_id,  
            'card_id': this.cardData.id,
          };
          
          this.service.paypalPayment(save_data).subscribe(res=>{
            console.log("response", res);
            this.service.presentToast(JSON.stringify(res));
            this.callCredit();            
          }, err =>{
            this.service.hideLoading()
            this.presentAlert("paypal error", JSON.stringify(err));
          });
        }, error=> {
          this.service.hideLoading()
          // Error or render dialog closed without being successful
          console.log("error", error);
        });
      }, (error) => {
        this.service.hideLoading()
        // Error in configuration
          console.log("Error in configuration", error);
      });
    }, (error) => {
      this.service.hideLoading()
      // Error in initialization, maybe PayPal isn't supported or something else
          console.log("rror in initialization, maybe PayPal isn't supported or something else", error);
    });
    
  }

  async presentAlert(type, msg) {
    const alert = await this.alertController.create({
      header: 'Payment Status',
      subHeader: type,
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  async showAlert() {
    this.alert = await this.popCtrl.create({
      component: PaypalPage,
      animated: true,
      backdropDismiss: true
    })
    await this.alert.present();
  }

  async dismissAlert() {
    await this.alert.dismiss();
  }

  expiredFormat(date: string) {
    console.log("input == : ", date)
    var expireDate: string;    
    if (date.includes("/")) {
      var dd = date.split("/")
      expireDate = dd["0"] + dd["1"]
    } else if (date.length > 4) {
      expireDate = date.substring(0, 4);
    } else if (date.length < 4) {
      expireDate = "0" + date;
    } else expireDate = date;
    this.mmyy = expireDate.substring(0, 2) + "/" + expireDate.substring(2, 4);
    console.log("expiredDate == : ", this.mmyy);    
  }

  checkCardNumber(cardNumber: string): boolean {
    console.log("cardNumber == : ", cardNumber)
    if (cardNumber.length < 16) {
      this.service.presentToast("Card number must be 16 characters.")
      return false
    } else if (!parseFloat(cardNumber)) {
      this.service.presentToast("Card number must number type.")
      return false
    } else {      
      return true
    }
  }

  checkCvvNumber(cvvNum): boolean {
    console.log("cvvNum == : ", cvvNum)
    if (cvvNum.length < 3) {
      this.service.presentToast("CVV number is invalid.")
      return false
    } else if (!parseFloat(cvvNum)) {
      this.service.presentToast("CVV number must number type.")
      return false
    } else {
      this.checkValid()
      return true
    }
  }

}
