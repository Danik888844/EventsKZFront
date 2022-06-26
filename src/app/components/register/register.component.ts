import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private as: AuthService,  private router: Router) { }

  public register(firstname: string, middlename: string,lastname: string, _age: string, _gender: string, email: string, password: string): boolean{

    if(!firstname || !middlename || !lastname || !_age || !email || !password){
      alert("Все поля должны быть заполнены!");
      return false;
    }

    let age = +(_age);
    let gender = +(_gender);

    this.as.register(firstname,middlename,lastname,age,gender,email,password).subscribe(res=>{
      if(res)
      {
        alert("Регистрация прошла успешно!");
        this.router.navigate(['/profile']);
      }
    }, error => {
      if(error.status == 400)
      {
        alert("Пользователь с таким логином уже зарегестрирован!");
      }
      else{
        alert(error.status);
      }
    })

    return true;
  }

}
