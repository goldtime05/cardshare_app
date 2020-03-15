import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { NavController } from '@ionic/angular';
import * as moment from 'moment';

@Component({
  selector: 'app-mycard',
  templateUrl: './mycard.page.html',
  styleUrls: ['./mycard.page.scss'],
})
export class MycardPage implements OnInit {

  myCards: any[] = [];
  userid: any;

  noCards: boolean = false;

  segment = 0;
  section: number = 2;

  months: any[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor(
    public r:Router,
    private service: ApiService,
    private navCtrl: NavController
    ) { }

  ngOnInit() {
    
  }

  onTabChange(event) {
    if (this.section == event.detail.index) return;
    this.segment = event.detail.index;
    this.getCars(this.segment);
    try {
      
    } catch (error) {
    }
  }

  getCars(kind) {
    this.section = kind;
    this.myCards = [];
    var user = JSON.parse(localStorage.getItem("user"))
    if (kind == 0) this.userid = user.mobile;
    else this.userid = user.id
    console.log("user mobile  ==== : ", this.userid)
    this.service.presentLoading()

    if (kind == 0) {      
      this.service.getAllReceiveCards(this.userid).subscribe((res) => {
        console.log("received res  ==== : ", res)
        var resp = JSON.parse(JSON.stringify(res));
        this.service.hideLoading()
        if (resp.status == "0") {
          this.myCards = [];
          this.noCards = true
        } else {
          this.service.hideLoading()
          this.myCards = resp.result;
          this.noCards = false
        }
      }, error => {
        this.service.hideLoading();
        console.log("error -- : ", error)
      })
    } else {
      this.service.getAllSentCards(this.userid).subscribe((res) => {
        console.log("sent res  ==== : ", res)
        var resp = JSON.parse(JSON.stringify(res));
        this.service.hideLoading()
        if (resp.status == "0") {
          this.myCards = [];
          this.noCards = true
        } else {
          this.service.hideLoading()
          this.myCards = resp.result;
          this.noCards = false
        }
      }, error => {
        this.service.hideLoading();
        console.log("error -- : ", error)
      })
    }
    
  }

  ionViewWillEnter() {
    // var user = JSON.parse(localStorage.getItem("user"))
    // this.userid = user.mobile;
    // console.log("user mobile  ==== : ", this.userid)
    // this.service.presentLoading()
    // this.service.getAllReceiveCards(this.userid).subscribe((res) => {
    //   console.log("res  ==== : ", res)
    //   var resp = JSON.parse(JSON.stringify(res));
    //   this.service.hideLoading()
    //   if (resp.status == "0") {
    //     this.myCards = []
    //   } else {
    //     this.myCards = resp.result;
    //   }
    // }, error => {
    //   this.service.hideLoading();
    //   console.log("error -- : ", error)
    // })
  }

  goto(p){
    // this.r.navigateByUrl(p);
    this.navCtrl.navigateForward(p)
  }

  goBack() {
    this.navCtrl.pop();
  }

  getDate(date) {
    // var getDate: Date = new Date(date)
    var getDate: Date = moment(date).toDate()
    return getDate.getDate() + "th " + this.months[getDate.getMonth()] + ", " + getDate.getFullYear()
  }

  calcMoney(val1?, val2?) {
    if (val1 && !val2) return val1;
    else if (!val1 && val2) return val2;
    else if (!val1 && !val2) return "";
    else return parseFloat(val1) + parseFloat(val2);
  }

  gotoReceivedCard(card, kind) {
    localStorage.setItem("received_card_details", JSON.stringify(card));
    localStorage.setItem("card_kind", kind);
    this.navCtrl.navigateForward('received-card')
  }

  checkMedia(card): boolean {
    if ((card.image1 && card.image1 != "") || (card.image2 && card.image2 != "") || (card.video && card.video != "")) return true;
    return false;
  } 
}
