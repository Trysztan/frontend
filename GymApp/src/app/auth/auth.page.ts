import { Component, OnInit } from '@angular/core';
import { AuthService } from '../global/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { User } from '../global/models/user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
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
  
    this.authService.login(username, password).subscribe(
      (user: User) => {
        console.log('Sikeres bejelentkezés:', user);
        this.loadingCtrl
          .create({ keyboardClose: true, message: 'Logging in...' })
          .then(loadingEl => {
            loadingEl.present();
            setTimeout(() => {
              this.isLoading = false;
              loadingEl.dismiss();
              this.router.navigateByUrl('/users');
            }, 500);
          });
      },
      () => {
        this.errormessage = "User not found:"
        this.isLoading = false;
        form.resetForm()
      }
    );
  }
  

  onSwitchAuthMode() {
    this.router.navigate(['/regist']);
  }
}
