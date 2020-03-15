import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {Plugins} from '@capacitor/core';
import { ApiService } from 'src/app/services/api.service';
import { IonSlides, NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

const {SplashScreen} = Plugins;

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  @ViewChild('slides', { static: true }) slider: IonSlides;
  @ViewChild('categorySlides', { static: true }) catSlider: IonSlides;

  componentDidLoad() {
    SplashScreen.hide();
  }

  segment = 0;  
  
  resArry: any = []
  resArryLoaded: any = []
  main_cat: any = [];
  categories: boolean = false;
  prod: boolean = false;
  searchBar:any;

  tabs: Array<{ label: string }>;
  noCards: boolean = false;

  section: number = 9;

  cardKinds: any[] = [
    {class: "kind0", image: "../../../assets/img/baby@2x.png", kind: "baby", title: "Newborn"},
    {class: "kind1", image: "../../../assets/img/Group 196@2x.png", kind: "wed", title: "Wedding"},
    {class: "kind2", image: "../../../assets/img/cake (1)@2x.png", kind: "birth", title: "Birthday"},
    {class: "kind3", image: "../../../assets/img/water-drop@2x.png", kind: "christen", title: "Christening"},
    {class: "kind4", image: "../../../assets/img/christmas-hat@2x.png", kind: "christmas", title: "Christmas"},
    {class: "kind5", image: "../../../assets/img/easter-egg@2x.png", kind: "east", title: "Easter"},
    {class: "kind6", image: "../../../assets/img/Path 710@2x.png", kind: "valentine", title: "Valentine's Day"},
    {class: "kind7", image: "../../../assets/img/mother-with-baby-in-arms@2x.png", kind: "mother", title: "Mother's Day"},
    {class: "kind8", image: "../../../assets/img/tie@2x.png", kind: "father", title: "Father's Day"},
    {class: "kind9", image: "../../../assets/img/chef@2x.png", kind: "kitchen", title: "Kitchen"}
  ]

  constructor(
    public service: ApiService,
    private navCtrl: NavController
    ) {    
    this.service.getMainCategories().subscribe(res => {
      this.main_cat = res.result;
      console.log('==== main_cat === : ', this.main_cat);
      console.log(this.main_cat[0].id);
    }, err => {

    });
  }

  ngOnInit() {
    // this.prod = true;
    const tabs = [];
    for (let i = 0; i < 10; i++) {
      tabs.push({ label: `Tab ${i}` });
    }
    this.tabs = tabs;
  }
  
  ionViewWillEnter() {

  }
  
  onTabChange(event) {
    if (this.section == event.detail.index) return;
    this.segment = event.detail.index;
    this.section = this.segment;
    try {
      if (this.segment !== 0) {
        this.categories = false;
        this.prod = true;
        this.getPro(this.segment);
      } else {
        this.categories = true;
        this.prod = false;
      }
    } catch (error) {

    }
  }
  
  getCategories() {
    this.categories = true;
    this.prod = false;
  }

  goto(p) {
    this.navCtrl.navigateForward(p)
  }

  price(p) {
    localStorage.removeItem('card_detail');
    this.service.presentLoading()
    this.service.getCategoryName(p.category_id).subscribe(data => {
      console.log('category name == : ', data)
      this.service.hideLoading()
      if (data.status == '1') {
        p['category_name'] = data['cat_name'];
        localStorage.setItem('card_detail', JSON.stringify(p));    
        this.navCtrl.navigateForward('card_detail');
      } else {
        alert(data.error)
      }
    }, error => {
      this.service.hideLoading()
      alert(error.error);
    })   
  }

  getPro(e) {
    this.noCards = false;
    this.resArry = [];
    this.resArryLoaded = [];
    this.service.presentLoading();
    this.service.getCategorie(e).subscribe(res => {
      console.log(res);
      this.service.hideLoading()
      if (res.status == '1') {
        this.resArry = res.result;
        this.resArryLoaded = res.result;
        this.noCards = false;
      } else {
        this.noCards = true;
      }
    }, err => {
      this.service.hideLoading()      
    });
  }

  gotoCards(kind, title) {
    console.log("=== card kind == : ", kind)
    let navExtras: NavigationExtras = {
      queryParams: kind,
      state: {
        value: kind,
        param: title
      }
    }
    this.navCtrl.navigateForward("card-kind", navExtras)
  }

  initializeItems(): void {
    this.resArry = this.resArryLoaded;    
  }

  getItems(searchbar) {
    console.log("=== searchbar === :", searchbar)
    this.initializeItems();
    let q = searchbar;
    if (!q) {
      return;
    }
    
    this.resArry = this.resArry.filter(item => item.sub_cat_name.toLowerCase().indexOf(q.toLowerCase()) > -1)
  }



}
