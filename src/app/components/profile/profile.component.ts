import { Component, OnInit } from '@angular/core';
import { ApiEvent } from 'src/app/models/ApiEvent';
import { User } from 'src/app/models/User';
import { EventService } from 'src/app/services/event.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private us: UserService, private es:EventService) { }

  public events: ApiEvent[] = [];
  public pastEvents: ApiEvent[] = [];

  public gender: string;
  public role: string = "Пользователь";

  public user: User;
  ngOnInit(): void {
    this.user = this.us.getUser();

    this.es.getUserEvents(this.user.id).subscribe(usEv=>{
      for(let i of usEv){
       this.es.getEvent(i).subscribe(res=>{
        if(new Date(res.eventDate) < new Date()){
          this.pastEvents.push(res);
        }
        else{
          this.events.push(res);
        }
        });
      }
    });

    switch(this.user.gender){
      case 0:
        this.gender = "Мужчина";
        break;

      case 1:
        this.gender = "Женщина";
          break;

      case 2:
        this.gender = "Другой";
          break;
    }

    if(this.user.roles.some(u=> u === 1)){
      this.role = "Администратор";
    }
  }

  public editUser(firstname: string, middlename: string,lastname: string, _age: string, _gender: string, email: string, password: string): boolean{
    if(!firstname || !middlename || !lastname || !_age || !email || !password){
      alert("Все поля должны быть заполнены!");
      return false;
    }

    let age = +(_age);
    let gender = +(_gender);

    this.us.updateUser(this.user.id,firstname,middlename,lastname,age,gender,email,password, this.user.roles).subscribe(res=>{
      if(res)
      {
        alert("Успешно!");
      }
    }, error => {
      alert(error.status);
    })

    return true;
  }

  //--

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
