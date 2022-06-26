import { Component, OnInit } from "@angular/core";
import { AuthService } from "./services/auth.service";
import { UserService } from "./services/user.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit{

  constructor(private as: AuthService, private us: UserService) {
  }

  ngOnInit(): void {
    if(this.isLoggedIn){
      this.us.setUser();
    }
  }

  public get isAdmin(): boolean{
    return this.us.getUser() ? this.us.getUser().roles.some(u => u === 1) : false;
  }

  public get isLoggedIn(): boolean{
    return this.as.isAuthenticated();
  }

  public logout(){
    this.as.logout();
    this.isAdmin;
  }

}