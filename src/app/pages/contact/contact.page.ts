import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { CurrencyPipe } from '@angular/common';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  params: any;
  public bankform: FormGroup;
  user: any;

  constructor(
    private route: ActivatedRoute, private router: Router, private navCtrl: NavController,
    public formBuilder: FormBuilder, private api: ApiService, private currencyPipe: CurrencyPipe,
    private nativeStorage: NativeStorage, private emailComposer: EmailComposer,
    private alertCtrl: AlertController
  ) { 
    this.route.queryParams.subscribe(param => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.params = this.router.getCurrentNavigation().extras.state.value;
      }
    })

    this.bankform = formBuilder.group({
      // email: ['', Validators.compose([Validators.required, Validators.pattern('^[A-Z0-9a-z._%+-]+@([A-Za-z0-9-]+.)+[A-Za-z]{2,4}$')])],
      bank_name: ['', Validators.compose([Validators.required])],
      bsb: ['', Validators.compose([Validators.required])],
      account_number: ['', Validators.compose([Validators.required])],
      account_name: ['', Validators.compose([Validators.required])],
      address: ['', Validators.compose([Validators.required])],
      country: ['', Validators.compose([Validators.required])],
    });
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("user"));

    this.nativeStorage.getItem("bank_info").then(data => {
      this.bankform.get("bank_name").setValue(data.bank_name)
      this.bankform.get("bsb").setValue(data.bsb)
      this.bankform.get("account_number").setValue(data.account_number)
      this.bankform.get("account_name").setValue(data.account_name)
      this.bankform.get("address").setValue(data.address)
      this.bankform.get("country").setValue(data.country)
    });
  }

  goBack() {
    this.navCtrl.pop();
  }

  getCurrency(amount: number) {
    return this.currencyPipe.transform(amount, 'USD', true, '1.2-2');
  }

  async previewEmail(value) {
    let alertCl = await this.alertCtrl.create({      
      message: `<h3>Ready to Cash Out?</h3>
        <h4>By clicking continue, you agree that your bank details are correct and we can deposit your money into that account</h4>`,
      buttons: [
        {
          text: "Cancel",
          role: "cancel"
        },
        {
          text: "Continue",
          handler: () => {
            this.transferMoney(value)
          }
        }
      ]
    });
    await alertCl.present();
  }

  transferMoney(value) {    

    let msg = {
      amount: this.getCurrency(this.params) + "AUD",
      bank_name: value.bank_name,
      bsb: value.bsb,
      account_number: value.account_number,
      account_name: value.account_name,
      address: value.address,
      country: value.country
    }

    var username = this.user.first_name + " " + this.user.last_name;

    this.nativeStorage.remove("bank_info").then(() => {
      this.nativeStorage.setItem("bank_info", msg);
    }).catch(() => {
      this.nativeStorage.setItem("bank_info", msg);
    })    

    this.api.presentLoading();

    this.api.sendEmail(this.user.email, username, msg).subscribe(response => {
      console.log("===== ", response)
      this.api.hideLoading();
      let data = JSON.parse(JSON.stringify(response));
      if (data.status == "1") {
        this.api.presentToast(data.message);
        this.updateUserData(this.user.mobile);
        this.navCtrl.navigateRoot("main")
      } else {
        this.api.presentAlert(data.message);        
      }
    }, error => {
      console.log("error ====> ", error);
      this.api.hideLoading();
    })


    
    // var message = `<div style='max-width: 600px; width: 100%; margin-left: auto; margin-right: auto;'>
    //           <header style='color: #fff; width: 100%;'>
    //             <h2>Have a nice day!</h2>
    //           </header>
    //           <div style='margin-top: 10px; padding-right: 10px; padding-left: 75px; padding-bottom: 20px;'>
    //             <hr>
    //             <h3 style='color: #232F3F;'>Hello. Admin! I am ${username}.</h3>
    //             <p>Request Amount: ${this.getCurrency(this.params)} AUD</p>
    //             <p>Bank Name: ${value.bank_name}</p>
    //             <p>BSB: ${value.bsb}</p>
    //             <p>Account Number: ${value.account_number}</p>
    //             <p>Account Name: ${value.account_name}</p>
    //             <p>Address: ${value.address}</p>
    //             <p>Country: ${value.country}</p>
    //             <hr>
    //             <p>user email is ${this.user.email}</p>
    //             <hr>
    //             <p>Please confirm them kindly.</p> 
    //             <hr>
    //             <p>Warm Regards.<br /></p>
    //           </div>
    //       </div>
    //     </div>`

    // let email = {
    //   to: 'admin@getgala.com.au',
    //   cc: 'admin@getgala.com.au',
    //   bcc: ['admin@getgala.com.au'],
    //   subject: 'Request transfer gifts.',
    //   body: message,
    //   isHtml: true
    // };

    // this.emailComposer.isAvailable().then((available: boolean) =>{
    //   if(available) {
    //     this.emailComposer.open(email).then((data) => {
    //       this.api.presentToast("Email sent to the admin successfully.");
    //       this.updateUserData(this.user.mobile);
    //       this.navCtrl.navigateRoot("main")
    //     });
    //   } else {
    //     this.api.presentAlert("Couldn't send the email now")
    //   }
    //  }).catch(error => {
    //     this.api.presentAlert("Sending email is not available")
    //  });
  }

  updateUserData(user_phone_number) {
    this.api.updateUserData(user_phone_number).subscribe(() => {
      this.api.hideLoading();
    })
  }

}
