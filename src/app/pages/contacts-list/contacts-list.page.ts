import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Events, NavController } from '@ionic/angular';
import { Contacts, Contact, ContactField, ContactName } from '@ionic-native/contacts/ngx';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.page.html',
  styleUrls: ['./contacts-list.page.scss'],
})
export class ContactsListPage implements OnInit {

  contacts: any[] = []
  searchContacts: any = []
  searchBar: any;

  constructor(
    private contact: Contacts,
    public api: ApiService,
    private event: Events,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.api.presentLoading()
    this.contact.find(["displayName", "phoneNumbers"], { multiple: true }).then((data) => {
      console.log("contact info == : ", JSON.stringify(data));
      for (let i in data) {
        var ccc: Contact = data[i];
        var pp = []
        if (ccc["_objectInstance"].phoneNumbers) {
          pp = ccc["_objectInstance"].phoneNumbers;
          for (let j in pp) {
            let cc = {};
            cc["name"] = ccc["_objectInstance"].name.formatted;
            cc["phone"] = pp[j].value
            this.contacts.push(cc);
            this.searchContacts.push(cc);
          }
        }
      }
      this.api.hideLoading()
    })
  }

  getPhone(code) {
    this.api.contactPhoneNumber = code
    this.event.publish(this.api.selectContactEvent);
  }

  initializeItems(): void {
    this.contacts = this.searchContacts;
  }

  getItems(ccc) {
    console.log("contact search === ", ccc)
    this.initializeItems();
    let q = ccc;
    if (!q) {
      return;
    }
    this.contacts = this.contacts.filter(item => item.name.toLowerCase().indexOf(q.toLowerCase()) > -1)
  }

  dismissModal() {
    this.event.publish(this.api.noSelectContactEvent);
  }

}
