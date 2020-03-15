import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ApiService } from 'src/app/services/api.service';
import { CurrencyPipe } from '@angular/common';
import { customAlertEnter } from '../../customAlertEnter';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { SpinnerDialog } from '@ionic-native/spinner-dialog/ngx';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';

declare var cordova

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  safeUrl: SafeResourceUrl;
  giftAmount: number = 0;

  option: any = [
    { head: 'Privacy Policy', sub_head: 'Read our privacy ploicy', goto: 'http://getgala.com.au/gala-tac.pdf' },
    { head: 'Terms and conditions', sub_head: 'Read our terms and conditions', goto: 'http://getgala.com.au/gala-tac.pdf' },
    { head: 'Contact support', sub_head: 'We are ready to assist you', goto: 'http://getgala.com.au/gala-tac.pdf' },
    // {head:"FAQ's",sub_head:'frequently asked questions',goto:''},
  ];

  userData: any = {};

  constructor(
    public r: Router, private navCtrl: NavController, private sanitizer: DomSanitizer,
    private service: ApiService, private alertCtrl: AlertController,
    private currencyPipe: CurrencyPipe, private iab: InAppBrowser,
    private spinner: SpinnerDialog, private documents: DocumentViewer
  ) {
    console.log(this.option);
    this.userData = localStorage.getItem('user');
    this.userData = JSON.parse(this.userData);
    this.service.getProfile(this.userData.id).subscribe((resp) => {
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(resp.result.image);
    }, error => {
      console.log("----------- ", error);
    })
    // this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.userData.image);
    console.log("user data ================= : ", this.userData)
  }

  ngOnInit() {
    this.service.presentLoading()
    this.service.getAllCollectable(this.userData.mobile).subscribe((res) => {
      console.log("=== user res  ==== : ", res)
      var resp = JSON.parse(JSON.stringify(res));
      this.service.hideLoading()
      if (resp.status == "0") {
        this.giftAmount = 0;
      } else {
        var data: any[] = [];
        data = resp.result;
        for (let i in data) {
          this.giftAmount += parseFloat(data[i].gift_amount)
        }
      }
    }, error => {
      this.service.hideLoading();
      console.log("error -- : ", error)
    })
  }

  goto(p) {
    this.navCtrl.navigateForward(p);
  }

  gotoRoot(page) {
    this.navCtrl.navigateRoot(page);
  }

  logout() {
    localStorage.clear();
    this.navCtrl.navigateRoot("home");
  }

  getCurrency(amount: number) {
    return this.currencyPipe.transform(amount, 'USD', true, '1.2-2');
  }
  //<button>
  //<ion-icon name="checkmark-circle-outline"></ion-icon>
  //Collect Money
  //</button>`
  async showCollection(amount) {
    let alert = await this.alertCtrl.create({
      message: `<h2>${this.getCurrency(this.giftAmount)} AUD</h2>`,
      cssClass: 'alert-danger',
      buttons: [
        {
          text: `☑ Collect Money`,
          handler: (data) => {
            this.gotoBankPage();
          }
        }
      ],
      enterAnimation: customAlertEnter
    });
    await alert.present();
  }

  gotoBankPage() {
    if (this.giftAmount == 0) {
      alert("There's no money in your account to cash out")
      return;
    }
    let navExtras: NavigationExtras = {
      queryParams: null,
      state: {
        value: this.giftAmount,
        param: this.giftAmount
      }
    }
    this.navCtrl.navigateForward("contact", navExtras);
  }

  openPdf(url) {
    window.open(url, '_system', 'location=yes')
  }

  openBrowser(url) {
    const options: InAppBrowserOptions = {
      clearcache: "yes",
      footer: "no",
      fullscreen: "yes",
      hardwareback: "yes",
      hidespinner: "no",
      presentationstyle: "pagesheet",
      toolbar: "no",
      hidden: "yes",
      closebuttoncaption: "Close",
      hidenavigationbuttons: "yes",
      hideurlbar: "yes",
      beforeload: "yes",
      location: "yes"
    }


    const browser = this.iab.create(url, '_self', options);

    browser.on('loadstart').subscribe(event => {
      if (event.url.endsWith('.pdf')) {
        //Open PDF in some other way
      }
      else {
        // browser.show();
        this.spinner.show("", "Loading...", false, { textColorBlue: 1, textColorGreen: 1, textColorRed: 1, overlayOpacity: 0.5 });
      }
    })

    browser.on('loadstop').subscribe(event => {
      browser.show();
      this.spinner.hide();
    });

    browser.on('exit').subscribe(event => {
      browser.close();
    })    
  }

  async sendContact() {    

    let alerts = await this.alertCtrl.create({
      message: "What issue are you facing",
      inputs: [
        {
          name: "prob",
          type: "text",
          placeholder: "Enter details about the issue you're having"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel"
        },
        {
          text: "Send",
          handler: (alertData) => {
            this.sendContactMail(alertData.prob);
          }
        }
      ]
    });
    await alerts.present();
  }

  sendContactMail(problem) {
    var username = this.userData.first_name + " " + this.userData.last_name;

    this.service.presentLoading();

    this.service.sendContactMail(this.userData.email, username, problem).subscribe(response => {
      console.log("===== ", response)
      this.service.hideLoading();
      let data = JSON.parse(JSON.stringify(response));
      if (data.status == "1") {
        this.service.presentToast(data.message);        
        this.alertCtrl.dismiss();
      } else {
        this.service.presentAlert(data.message);        
      }
    }, error => {
      console.log("error ====> ", error);
      this.service.hideLoading();
    })
  }
}
