import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-card-kind',
  templateUrl: './card-kind.page.html',
  styleUrls: ['./card-kind.page.scss'],
})
export class CardKindPage implements OnInit {

  paramData: any;
  title: any;
  cardArray: any[] = [];

  constructor(
    private route: ActivatedRoute, public router: Router, private service: ApiService,
    private navCtrl: NavController
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.paramData = this.router.getCurrentNavigation().extras.state.value;
        this.title = this.router.getCurrentNavigation().extras.state.param;
        console.log(this.paramData)
      }
    })
  }

  ngOnInit() {
    this.cardArray = [];    
    this.service.presentLoading();
    this.service.getCardFromKind(this.paramData).subscribe(res => {
      console.log("--- card kind data == : ", res);
      this.service.hideLoading()
      if (res.status == '1') {
        this.cardArray = res.result;        
      } else {
        this.service.hideLoading()
        this.service.presentAlert("No cards available for this category").then(() => {
          this.navCtrl.pop();
        })
      }
    }, err => {
      console.log("--- card kind error == : ", err);
      this.service.hideLoading()
    });
  }

  price(p) {
    localStorage.removeItem('card_detail');
    localStorage.setItem('card_detail', JSON.stringify(p));
    this.navCtrl.navigateForward('card_detail');
  }

  goBack() {
    this.navCtrl.pop();
  }

}
