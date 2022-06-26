import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiEvent } from "src/app/models/ApiEvent";
import { Coordinates } from "src/app/models/Coordinates";
import { User } from "src/app/models/User";
import { AuthService } from "src/app/services/auth.service";
import { EventService } from "src/app/services/event.service";
import { UserService } from "src/app/services/user.service";

@Component({
    selector: 'app-item-event',
    templateUrl: './event.component.html',
    styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  constructor(
    private es: EventService, 
    private us: UserService, 
    private as: AuthService, 
    private activateRoute: ActivatedRoute){}

  public paymentRequest!: google.payments.api.PaymentDataRequest;
  public isApproved: boolean;
  public isPast: boolean;
  public isAdmin: boolean = false;
  
  public user: User;
  public owner: User;
  public id: number | undefined;
  public event: ApiEvent;
  
  public price: number;
  public image: any;
  public lat: number;
  public lng: number;
  public imgInput: any;
  public numbers: string;

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params=>this.id=params['id']);
    
    this.es.getEvent(this.id).subscribe(res=>{
        this.event = res;

        this.price = this.event.price;
        this.image = this.event.photos;
        this.lat = this.event.coordinates.lat;
        this.lng = this.event.coordinates.lng;
        this.isApproved = this.event.isApproved;
        this.isPast = !(new Date(this.event.eventDate) >= new Date());
        this.numbers = this.event.numbers.join(' , ');
        
        this.us.getUserById(this.event.owner).subscribe(res=>{
          this.owner = res
        }, err => {
          console.log("Error! " + err);
        })

        this.paymentRequest = {
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [
            {
              type: 'CARD',
              parameters:{
                allowedAuthMethods: ['PAN_ONLY','CRYPTOGRAM_3DS'],
                allowedCardNetworks: ['MASTERCARD','VISA'],
              },
              tokenizationSpecification:{
                type:'PAYMENT_GATEWAY',
                parameters:{
                  gateway: 'example',
                  gatewayMerchantId: 'exampleGatewayMerchantId',
                },
              },
            },
          ],
          merchantInfo: {
            merchantId: '12345678901234567890',
            merchantName: 'Demo Only'
          },
          transactionInfo:{
            totalPriceStatus: 'FINAL',
            totalPriceLabel: 'Total',
            totalPrice: this.event.price.toString(),
            currencyCode: 'KZT',
            countryCode: 'BE',
          },
        }
    });

    if(this.as.isAuthenticated()){ // -----------Здесь же проверяется токен---------
      this.user = this.us.getUser();
      if(this.user && this.user.roles.some(u => u === 1)){
        this.isAdmin = true;
      }
    }
  }

  // -----------EDIT---------
  public editEvent(name: string, description: string, _price: string, _numbers: string, eventDate: string): boolean{
    if(!name || !description || !_price || !_numbers || !eventDate ){
      alert("Все поля должны быть заполнены!");
      return false;
    }

    let price = +(_price);
    let numbers = _numbers.split(",");

    let coord: Coordinates = new Coordinates();
    
    coord.lat = this.lat;
    coord.lng = this.lng;

    this.es.updateEvent(this.id, name, description, this.image, price, numbers, coord, new Date(eventDate), this.isApproved).subscribe(res=>{
      if(res){
        alert("Успешно!");
      }
    }, error=>{
      alert(error);
    });

    this.handleCancel();
    return true;
  }

  // -----------DELETE---------
  public deleteEvent():void{
    if (confirm("Удалить МП с ID:" + this.id + ". Вы уверены?") == true) {
      this.es.deleteEvent(this.id).subscribe(res=>{

        if(res){
          alert("Успешно удалено!");
        }

      }, error=>{
        alert(`[${error.status}] Произошла ошибка!`);
      });

    }
  }

  // -----------GOOGLE MAP---------
  public mapClicked(lat: number, lng: number){
    this.lat = lat;
    this.lng = lng;
    console.log(lat,lng);
  }

  // -----------GOOGLE PAY---------
  async onLoadPaymentData(){
  await this.es.setEventToUser(this.id,this.user.id).subscribe(res=>{
    }, error=>{

      if(error.status == 200){
        alert("Успешно!");
      }
      else{
        alert(`[${error.status}] Вы уже приобрели этот билет!`);
      }

    });
  }

  // -----------SET IMG---------
  public upload(event: any){
    const file = event.target.files[0];
  
    const reader = new FileReader();

      if (file) {
        reader.readAsDataURL(file);
      }
      
      return new Promise((resolve,reject)=>{
          reader.onload = () => {
            this.image = reader.result;
            this.image = btoa(this.image);
        };
      });
  }

  // -----------REMOVE IMG---------
  public removeImage(){
    this.imgInput = "";
    this.image = "";
  }

  // -----------MODAL---------
  isVisible = false;

  openEdit(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}