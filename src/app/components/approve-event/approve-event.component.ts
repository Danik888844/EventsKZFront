import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiEvent } from 'src/app/models/ApiEvent';
import { EventService } from 'src/app/services/event.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-approve-event',
  templateUrl: './approve-event.component.html',
  styleUrls: ['./approve-event.component.css']
})
export class ApproveEventComponent implements OnInit {

  constructor(private us: UserService,private es: EventService, private route: Router) { }
  
  public events: ApiEvent[] = [];

  ngOnInit(): void {
    if(!this.us.getUser().roles.some(u => u === 1)){
      this.route.navigate(['']);
    }

    this.es.getEvents()
    .subscribe((res) => {
      this.events = res.filter(e => e.isApproved == false);;
    })
  }

  // -----------DELETE---------

  public deleteEvent(id: number):void{
    if (confirm("Удалить МП с ID:" + id + ". Вы уверены?") == true) {
      this.es.deleteEvent(id).subscribe(res=>{

        if(res){
          alert("Успешно удалено!");
          this.events.forEach((ev,index)=>{

            if(ev.id==id) {
              this.events.splice(index,1);
            }
            
          });
        }

      }, error=>{
        alert(`[${error.status}] Произошла ошибка!`);
      });

    }
  }


}
