import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Events } from '@ionic/angular';

@Component({
  selector: 'app-country-code',
  templateUrl: './country-code.page.html',
  styleUrls: ['./country-code.page.scss'],
})
export class CountryCodePage implements OnInit {

  countries: any[] = []
  searchCountry: any[] = []
  searchBar: any;

  constructor(
    public api: ApiService,
    private event: Events
  ) { }

  ngOnInit() {
    this.api.getData().subscribe(data => {
      this.countries = data;
      this.searchCountry = data;
    }, error => {
      console.log("error===: ", error);
    })
  }

  getCountry(code) {
    this.api.countryCode = code
    this.event.publish(this.api.selectCountryCodeEvent);
  }

  initializeItems(): void {
    this.countries = this.searchCountry;    
  }

  getItems(ccc) {
    console.log("contact search === ", ccc)
    this.initializeItems();
    let q = ccc;
    if (!q) {
      return;
    }
    this.countries = this.countries.filter(item => item.name.toLowerCase().indexOf(q.toLowerCase()) > -1)
  }

  dismissModal() {
    this.event.publish(this.api.noSelectContactEvent);
  }

}
