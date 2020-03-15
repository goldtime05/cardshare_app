import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import * as moment from 'moment';
import { VideoPlayer } from '@ionic-native/video-player/ngx';

import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

@Component({
  selector: 'app-received-card',
  templateUrl: './received-card.page.html',
  styleUrls: ['./received-card.page.scss'],
})
export class ReceivedCardPage implements OnInit {

  receiveCard: any;
  months: any[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  kind: any;

  sliderConfig = {
    slidesPerView: 3,
    spaceBetween: 2
  }

  photos: any = []

  constructor(
    public router: Router,
    private navCtrl: NavController,
    private videoPlayer: VideoPlayer,
    private file: File,
    private transfer: FileTransfer,
    private filePath: FilePath,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.receiveCard = JSON.parse(localStorage.getItem("received_card_details"));
    this.kind = localStorage.getItem("card_kind");

    if (this.receiveCard.image1) {
      let photoArray: any = {}
      photoArray["image"] = this.receiveCard.image1;
      this.photos.push(photoArray);
    }
    if (this.receiveCard.image2) {
      let photoArray: any = {}
      photoArray["image"] = this.receiveCard.image2;
      this.photos.push(photoArray);
    }
    if (this.receiveCard.video) {
      let photoArray: any = {}
      photoArray["video"] = this.receiveCard.video;
      this.photos.push(photoArray);
    }
    console.log("media ==== : ", this.photos)
  }

  goto(p) {
    this.router.navigateByUrl(p);
  }
  goback() {
    this.navCtrl.pop();
  }

  calcMoney(val1, val2) {
    if (val1 && !val2) return val1;
    else if (!val1 && val2) return val2;
    else if (!val1 && !val2) return "";
    else return parseFloat(val1) + parseFloat(val2);
  }

  getDate(date) {
    var getDate: Date = moment(date).toDate()
    return getDate.getDate() + "th " + this.months[getDate.getMonth()] + ", " + getDate.getFullYear()
  }

  videoView(videoUrl) {
    console.log('video start');
    // this.videoPlayer.play(videoUrl).then(() => {
    //   console.log('video completed');
    // }).catch(err => {
    //   console.log(err);
    // });
    let navExtras: NavigationExtras = {
      queryParams: null,
      state: {
        value: videoUrl,
        param: videoUrl
      }
    }
    this.navCtrl.navigateForward("add-profile", navExtras);
  }

  downloadFiles() {
    var fileTransfer: FileTransferObject = this.transfer.create();

    for (let item in this.photos) {
      var fileUrl: any;
      var fileName: any;
      if (this.photos[item].image) fileUrl = this.photos[item].image;
      else if (this.photos[item].video) fileUrl = this.photos[item].video;
      else continue;
      fileName = fileUrl.substr(fileUrl.lastIndexOf('/') + 1);
      console.log("fileUrl== : " + fileUrl + ", fileName == : " + fileName);

      if (this.platform.is('cordova')) {
        this.file.checkDir(this.file.externalRootDirectory, 'downloads')
          .then(
            // Directory exists, check for file with the same name
            _ => this.file.checkFile(this.file.externalRootDirectory, 'downloads/' + fileName)
              .then(_ => { alert("A file with the same name already exists!") })
              // File does not exist yet, we can save normally
              .catch(err =>
                fileTransfer.download(fileUrl, this.file.externalRootDirectory + '/downloads/' + fileName).then((entry) => {
                  alert('File saved in:  ' + entry.nativeURL);
                })
                  .catch((err) => {
                    alert('Error saving file: ' + err.message);
                  })
              ))
          .catch(
            // Directory does not exists, create a new one
            err => this.file.createDir(this.file.externalRootDirectory, 'downloads', false)
              .then(response => {
                alert('New folder created:  ' + response.fullPath);
                fileTransfer.download(fileUrl, this.file.externalRootDirectory + '/downloads/' + fileName).then((entry) => {
                  alert('File saved in : ' + entry.nativeURL);
                })
                  .catch((err) => {
                    alert('Error saving file:  ' + err.message);
                  });

              }).catch(err => {
                alert('It was not possible to create the dir "downloads". Err: ' + err.message);
              })
          );

      } else {
        // If downloaded by Web Browser
        let link = document.createElement("a");
        link.download = name + fileName;
        link.href = fileUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        link = null;
      }
    }
  }
}
