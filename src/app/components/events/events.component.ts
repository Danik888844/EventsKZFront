import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiEvent } from 'src/app/models/ApiEvent';
import { Coordinates } from 'src/app/models/Coordinates';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { EventService } from 'src/app/services/event.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  constructor(private as: AuthService ,
    private es: EventService, 
    private us: UserService, 
    private router: Router) { }
  
  public user: User;
  public events: ApiEvent[] = [];
  public result: ApiEvent[] = [];
  public isAdmin: boolean = false;

  public lat: number;
  public lng: number;
  public image: any;
  public imgInput: any;

  ngOnInit(): void {
    this.es.getEvents()
    .subscribe((res) => {
      this.events = res.filter(e => e.isApproved);
      this.result = this.events.filter(e => new Date(e.eventDate) >= new Date());
    })

    if(this.as.isAuthenticated()){ // -----------Здесь же проверяется токен---------
      this.user = this.us.getUser();
      if(this.user && this.user.roles.some(u => u === 1)){
        this.isAdmin = true;
      }
    }
  }

  public searchButton(searchable: string):void{
    this.result = [];
    for(let ev of this.events){
        if(ev.name.toLowerCase().includes(searchable.toLowerCase())){
            this.result.push(ev);
        }
    }
  }

  public showPast(chk: string[]){
    this.result = [];
    if(chk.length != 0){
      this.events.filter(e => {
        if(new Date(e.eventDate) >= new Date()){
            this.result.push(e);
        }
      });
    }
    else{
      this.result = this.events;
    }
  }

  public createEvent(name: string, description: string, _price: string, _numbers: string, eventDate: string): boolean{

    if(!name || !description || !_price || !_numbers || !eventDate || !this.lat || !this.lat){
      alert("Все поля должны быть заполнены!");
      return false;
    }

    let price = +(_price);
    let numbers = _numbers.split(",");

    let coord: Coordinates = new Coordinates();
    
    coord.lat = this.lat;
    coord.lng = this.lng;

    this.es.createEvent(name, description, this.image, price, numbers, coord, new Date(eventDate), this.user.id).subscribe(res=>{
      if(res){
        alert("Успешно! Ваше мероприятие отправлено на проверку.");
        this.router.navigate([`/event-item/${res.id}`]);
      }
    }, error=>{
      alert(error);
    });

    return true;
  }

  public deleteEvent(id: number):void{
    if (confirm("Удалить МП с ID:" + id + ". Вы уверены?") == true) {
      this.es.deleteEvent(id).subscribe(res=>{
        if(res){
          alert("Успешно удалено!");
          this.events.forEach((ev,index)=>{
            if(ev.id==id) {
              this.events.splice(index,1);
              this.result = this.events;
            }
          });
        }
      }, error=>{
        alert(`[${error.status}] Произошла ошибка!`);
      });

    }
  }

  public mapClicked(lat: number, lng: number){
    this.lat = lat;
    this.lng = lng;
    console.log(lat,lng);
  }

  public upload(event: any){
    const file = event.target.files[0];

    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
    }
      
    return new Promise(()=>{
      reader.onload = () => {
        this.image = reader.result;
        this.image = btoa(this.image);
      };
    });
  }

  public removeImage(){
    this.imgInput = "";
    this.image = "";
  }

  // -----------MODAL---------
  isVisible = false;

  openCreate(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}

