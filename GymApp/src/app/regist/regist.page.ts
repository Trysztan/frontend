import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { catchError, finalize, switchMap, throwError } from 'rxjs';
import { User } from 'src/app/global/models/user.model';
import { UserServiceService } from 'src/app/global/services/user-service.service';

function base64toBlob(base64Data: string, contentType: string) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

@Component({
  selector: 'app-regist',
  templateUrl: './regist.page.html',
  styleUrls: ['./regist.page.scss'],
})
export class RegistPage implements OnInit {
  users: User[]=[];
  id: number = this.users.length;
  isLoading = false;
  isUpdate: boolean = false;
  updatedId: number = 0;
  imagePath="https://ionicframework.cm/docs/img/demos/avatar.svg"
  form!: FormGroup<any>;
  imageFile?: File | null = null;
  isLogin?: boolean;

  constructor(
    private userService: UserServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      username: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required,Validators.min(3)]
      }),
      email: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      password: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(6)]
      }),
      height: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      weight: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      image: new FormControl(null)
    });
  
  }

  onSwitchAuthMode() {
    this.router.navigate(['/auth']);
  }

  onImagePicked(imageData: string | File | undefined) {
    if (imageData) {
      if (typeof imageData === 'string') {
        try {
          this.imageFile = new File(
            [base64toBlob(imageData.replace('data:image/jpeg;base64,', ''), 'image/jpeg')],
            'image.jpg',
            { type: 'image/jpeg', lastModified: Date.now() }
          );
          console.log(this.imageFile);
        } catch (error) {
          console.log(error);
        }
      } else if (imageData instanceof File) {
        this.imageFile = imageData;
        console.log(this.imageFile);
      }
    }
    this.form.patchValue({ image: this.imageFile });
  }
  
  onCreateUser() {
    if (!this.form?.valid) {
      return;
    }
  
    const user = new User(
      this.id++,
      this.form?.value.username,
      this.form?.value.email,
      this.form?.value.password,
      this.form?.value.height,
      this.form?.value.weight,
      ""
    );
  
    this.loadingCtrl
      .create({
        message: 'Creating user...'
      })
      .then(loadingEl => {
        loadingEl.present();
        this.userService
          .createUser(user, this.form.value.image)
          .pipe(
            catchError(error => {
              console.error('Hiba történt:', error);
              return throwError(error);
            }),
            finalize(() => {
              loadingEl.dismiss();
            })
          )
          .subscribe(() => {
            this.form?.reset();
            this.router.navigate(['/auth']);
          });
      });
  }
  
  
}
