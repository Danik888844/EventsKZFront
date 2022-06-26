import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/User';
import { EventService } from '../services/event.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-setting-users',
  templateUrl: './setting-users.component.html',
  styleUrls: ['./setting-users.component.scss']
})
export class SettingUsersComponent implements OnInit {

  constructor(private es: EventService, 
    private us: UserService, private route: Router) { }

  public users: User[] = [];

  ngOnInit(): void {
    if(!this.us.getUser().roles.some(u => u === 1)){
      this.route.navigate(['']);
    }
    
    this.us.getUsers()
    .subscribe((res) => {
      this.users = res;
    })
  }

  public getRole(roles: number[]): number{ // PIPE
    if(roles.some(u=> u === 1)){
      return 1;
    }
    return 0;
  }

  public setRole(id: string,_role: string){
    let roles: number[] = [0];

    if(!roles.includes(+(_role))){
      roles.push(+(_role));
    }

    this.us.setUserRole(id, roles).subscribe(res=>{
      alert("Успешно! Роль изменена.");
    }, error=>{
      alert(`[${error.status}] Произошла ошибка!` + roles);
    });
  }

  // -----------DELETE EVENTS---------
  public deleteEventWhereUser(name: string, id: string):void{
    if (confirm("Удаление всех МП-ий пользователя с именем: " + name + ". Вы уверены?") == true) {
      this.es.deleteEventWhereOwner(id).subscribe(res=>{
        alert("Успешно! Удалено: " + res + " мероприятий.");
      }, error=>{
        alert(`[${error.status}] Произошла ошибка!`);
      });

    }
  }

  // -----------DELETE USER---------
  public deleteUser(name: string,id: string):void{
    if (confirm("Удаление пользователя с именем: " + name + ". Вы уверены?") == true) {
      this.us.deleteUser(id).subscribe(res=>{
        if(res){
          alert("Успешно удалено!");
          this.users.forEach((us,index)=>{
            if(us.id==id) {
              this.users.splice(index,1);
            }
          });
        }
      }, error=>{
        alert(`[${error.status}] Произошла ошибка!`);
      });

    }
  }

}
