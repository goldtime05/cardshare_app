import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, PopoverController, Events, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts/ngx';
import { CountryCodePage } from "../country-code/country-code.page";
import { ContactsListPage } from "../contacts-list/contacts-list.page";

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit {

  data: any = {};
  receive_phone: string;
  countryCode: string;
  price: any;

  constructor(
    public router: Router,
    private navCtrl: NavController,
    private api: ApiService,
    private contacts: Contacts,
    private popoverCtrl: PopoverController,
    private event: Events,
    private modalCtrl: ModalController
  ) {
    this.receive_phone = "";
    this.countryCode = "";

    event.subscribe(this.api.selectCountryCodeEvent, () => {
      this.DismissClick();
    });
    event.subscribe(this.api.selectContactEvent, () => {
      this.DismissContacts();
    })
    event.subscribe(this.api.noSelectContactEvent, () => {
      this.closeModal();
    })
  }

  ngOnInit() {

  }

  goto(p) {
    if (this.receive_phone == "") {
      alert("Please input the recipent's mobile number");
      return;
    } else if (this.countryCode == "") {
      alert("Please input the country code.");
      return;
    } else {
      this.api.presentLoading();
      var phoneNum = this.countryCode + this.receive_phone
      this.api.getProfileFromPhone(phoneNum).subscribe((resp) => {
        console.log("phone result == : ", resp.result)
        this.api.hideLoading()
        if (resp.status == "1") localStorage.setItem("receiver_info", JSON.stringify(resp.result));
        else {
          localStorage.removeItem("receiver_info");
          localStorage.setItem('receive_phone', phoneNum);
        }
        this.navCtrl.navigateForward(p);
      }, error => {
        this.api.hideLoading()
        console.log("phone error == : ", error)
      })
    }
  }

  goBack() {
    this.navCtrl.pop()
  }

  ionViewWillEnter() {
    var store = localStorage.getItem('data');
    this.data = JSON.parse(store);
    console.log("======  summary data  ======= : ", this.data)
    this.price = this.data.price;
  }

  async showCountryCode(ev) {
    const modal = await this.modalCtrl.create({
      component: CountryCodePage,      
      showBackdrop: true,
    });
    return await modal.present();
  }

  async DismissClick() {
    if (this.api.countryCode.includes(" ")) {
      var ss = this.api.countryCode.split(" ");
      this.countryCode = ss[0] + ss[1]
      // this.receive_phone = ss[1]
    } else this.countryCode = this.api.countryCode;

    await this.modalCtrl.dismiss();
  }

  getContacts() {
    // this.contacts.find(["displayName", "phoneNumbers"], { multiple: true }).then((contacts) => {
    //   console.log("contact info == : ", contacts)
    // })
  }

  async showContactsList() {
    const modal = await this.modalCtrl.create({
      component: ContactsListPage,      
      showBackdrop: true,
    });
    return await modal.present();
  }

  checkPhoneNumber() {
    console.log(" phone number === ", this.receive_phone);
    if (this.receive_phone == null) {
      alert("Invalid phone number. Input correct phone number please.")
      this.receive_phone = ""
      return;
    }
    else if (this.receive_phone == "") {
      alert("Invalid phone number. Input correct phone number please.")
      this.receive_phone = ""
      return;
    }
    var phh = "" + this.receive_phone
    var pp: string = "";
    if (phh.includes("+")) {
      if (phh.includes("+1")) {
        this.countryCode = phh.substring(0, 2)
        pp = phh.substring(2, phh.length);        
      } else {
        this.countryCode = phh.substring(0, 3)
        pp = phh.substring(3, phh.length)
      }
    } else pp = phh;
    
    if (pp.charAt(0) == "0") pp = pp.substring(1, pp.length);

    var aa = []
    var ppp: string = "";

    if (pp.substring(0, 1) == " " || pp.substring(0, 1) == "-") {
      ppp = pp.substring(1, pp.length);      
    } else {
      ppp = pp
    }

    if (ppp.charAt(0) == "0") ppp = ppp.substring(1, ppp.length);

    var pss: string = ""

    if (ppp.includes("(") || ppp.includes(")")) {
      var ss = ppp.substring(1, 4);
      var sss = ppp.substring(5, ppp.length);
      var ww: string = "";
      if (sss.substring(0, 1) == " " || sss.substring(0, 1) == "-") ww = sss.substring(1, sss.length)
      else ww = sss
      var q = []
      if (ww.includes(" ")) {
        q = ww.split(" ")
      } else if (ww.includes("-")) q = ww.split("-")
      else q = [ww]
      pss = ss + q[0] + q[1]
    } else pss = ppp

    if (pss.includes(" ")) aa = pss.split(" ")
    else if (pss.includes("-")) aa = pss.split("-")
    else aa = [pss]

    this.receive_phone = ""
    for (let i of aa) {
      this.receive_phone += i;      
    }
    console.log(" == phone number === ", this.receive_phone);
  }

  async DismissContacts() {
    this.receive_phone = "";
    var pp: string = "";
    if (this.api.contactPhoneNumber.includes("+")) {
      if (this.api.contactPhoneNumber.includes("+1")) {
        this.countryCode = this.api.contactPhoneNumber.substring(0, 2)
        pp = this.api.contactPhoneNumber.substring(2, this.api.contactPhoneNumber.length);        
      } else {
        this.countryCode = this.api.contactPhoneNumber.substring(0, 3)
        pp = this.api.contactPhoneNumber.substring(3, this.api.contactPhoneNumber.length)
      }
    } else pp = this.api.contactPhoneNumber;
    
    if (pp.charAt(0) == "0") pp = pp.substring(1, pp.length);

    var aa = []
    var ppp: string = "";

    if (pp.substring(0, 1) == " " || pp.substring(0, 1) == "-") {
      ppp = pp.substring(1, pp.length);      
    } else {
      ppp = pp
    }

    if (ppp.charAt(0) == "0") ppp = ppp.substring(1, ppp.length);

    var pss: string = ""

    if (ppp.includes("(") || pp.includes(")")) {
      var ss = ppp.substring(1, 4);
      var sss = ppp.substring(5, ppp.length);
      var ww: string = "";
      if (sss.substring(0, 1) == " " || sss.substring(0, 1) == "-") ww = sss.substring(1, sss.length)
      else ww = sss
      var q = []
      if (ww.includes(" ")) {
        q = ww.split(" ")
      } else if (ww.includes("-")) q = ww.split("-")
      else q = [ww]
      pss = ss + q[0] + q[1]
    } else pss = ppp

    if (pss.includes(" ")) aa = pss.split(" ")
    else if (pss.includes("-")) aa = pss.split("-")
    else aa = [pss]

    for (let i of aa) {
      this.receive_phone += i;
    }

    console.log("phone number == : ", this.receive_phone)

    await this.modalCtrl.dismiss();
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }

  saveContacts() {
    let contact: Contact = this.contacts.create();
    contact.name = new ContactName(null, 'Smith', 'John');
    contact.phoneNumbers = [new ContactField('mobile', '6471234567')];
    contact.save().then(
      () => console.log('Contact saved!', contact),
      (error: any) => console.error('Error saving contact.', error)
    );
  }

}
