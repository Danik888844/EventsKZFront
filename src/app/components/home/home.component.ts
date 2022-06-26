import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public array: string[] = [];

  ngOnInit(): void {
    
    //GALLERY IMAGES
    this.array = [
      "https://baigenews.kz/upload/iblock/af4/Samye-vazhnye-sobytiya-2021-goda-v-Kazakhstane-i-mire-_-BaigeNews.kz.jpg",
      "https://vesti.kz/userdata/news/2021/news_295841/crop_b/photo_161384.jpg",
      "https://sun9-24.userapi.com/impf/c852120/v852120240/2008b/X4dQVGJOCoI.jpg?size=604x460&quality=96&sign=4db9044e257aa8209f347cbbc6b471f0&type=album",
      "https://a.d-cd.net/TqAAAgHFJuA-960.jpg"];
  }
}
