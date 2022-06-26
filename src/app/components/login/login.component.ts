import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private as: AuthService,  private router: Router) { }

  public login(email: string, password: string){
    this.as.login(email,password).subscribe(res=>{
      this.router.navigate(['']);
    }, error => {
      alert("Wrong login or password!")
    })
  }

}
