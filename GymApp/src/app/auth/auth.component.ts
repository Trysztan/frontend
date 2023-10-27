import { Component, OnInit } from '@angular/core';
import { AuthService } from '../global/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, LoadingController } from '@ionic/angular';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { User } from '../global/models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  standalone:true,
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
  ],
})
export class AuthComponent implements OnInit {
  errormessage=""
  isLoading = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const username = form.value.username;
    const password = form.value.password;
    console.log(username, password);
    this.isLoading = true;
  
    this.authService.login(username, password)
    .subscribe((loginSuccess) => {
      if (loginSuccess) {
        this.loadingCtrl.create({ keyboardClose: true, message: 'Logging in...' })
          .then(loadingEl => {
            loadingEl.present();
            setTimeout(() => {
              this.isLoading = false;
              loadingEl.dismiss();
              form.resetForm();
              this.router.navigateByUrl('/users');
            }, 500);
          });
      } else {
        console.log('Sikertelen bejelentkezés:');
        this.errormessage = "Login failed! User not found!"
        this.isLoading = false;
        form.resetForm();
      }
    });
  }
  

  onSwitchAuthMode() {
    this.router.navigate(['/regist']);
  }
}
