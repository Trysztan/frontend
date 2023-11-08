import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormControl,FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, LoadingController } from '@ionic/angular';
import { catchError, finalize, throwError } from 'rxjs';
import { GlobalModule } from 'src/app/global/global.module';
import { User } from 'src/app/global/models/user.model';
import { UserService } from 'src/app/global/services/User/user.service';

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
  standalone: true,
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    GlobalModule,
  ],
})

export class UserProfilePage implements OnInit {
  selectedUser: any;
  selectedUserId?: number;
  isUpdate: boolean = false;
  form!: FormGroup<any>;
  isUpdateImage: boolean = false;

  profilePic?: any;
  imagePath=""

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.selectedUserId = +params['id'];

      this.getUser();
      this.getUserPic();
    })

  }

  initializeForm() {
    this.form = this.formBuilder.group({
      username: [this.selectedUser.username, [Validators.required, Validators.minLength(3)]],
      email: [this.selectedUser.email],
      password: [this.selectedUser.password, Validators.minLength(3)],
      weight: [this.selectedUser.weight],
      height: [this.selectedUser.height],
      image: [this.selectedUser.imagePath]
    });
  }

  getUser(){
    if(this.selectedUserId){
    this.userService.getUserById(this.selectedUserId).subscribe(data =>{
      this.selectedUser = data;
      console.log(this.selectedUser)
      this.initializeForm();
    })
  }
  }

  getUserPic(){
    if (this.selectedUserId) {
      this.userService.profilePic(this.selectedUserId).subscribe((image) => {
        this.profilePic = URL.createObjectURL(image);
        console.log(this.profilePic)
      });
    }
  }

updateSession(){
  this.isUpdate ? this.isUpdate = false : this.isUpdate = true;
}

updateImage(){
  this.isUpdateImage ?  this.isUpdateImage = false : this.isUpdateImage = true;
}

onUpdateUser() {
  if (!this.form?.valid || !this.selectedUserId) {
    return;
  }

  const updatedUser = new User(
    this.selectedUserId,
    this.form.value.username,
    this.form.value.email,
    this.form.value.password,
    this.form.value.height,
    this.form.value.weight,
    this.selectedUser.imagePath,
  );

  this.loadingCtrl
    .create({
      message: 'Updating user...'
    })
    .then(loadingEl => {
      loadingEl.present();
      this.userService
        .updateUser(updatedUser,this.selectedUser ,this.form?.value.image)
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
          this.updateSession()
          this.updateImage()
          this.router.navigate(['/users', 'list']);
        });
    });
}


deleteUser(userId: number){
  this.userService.deleteUser(userId).subscribe(
    ()=>{
      console.log("User deleted!");
  },
  () =>{
    console.error("Error!");
  }
  )
}
//Kép kezelése

onImagePicked(imageData: string | File) {
  let imageFile;
  if (typeof imageData === 'string') {
    try {
      imageFile = base64toBlob(
        imageData.replace('data:image/jpeg;base64,', ''),
        'image/jpeg'
      );
    } catch (error) {
      console.log(error);
      return;
    }
  } else {
    imageFile = imageData;
  }
  this.form?.patchValue({ image: imageFile });
}
}
