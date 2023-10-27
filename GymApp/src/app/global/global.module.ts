import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';


import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';
import { CategoryPickerComponent } from './pickers/category-picker/category-picker.component';

@NgModule({
  declarations: [
    ImagePickerComponent,
    CategoryPickerComponent
  ],
  imports: [CommonModule, IonicModule],
  exports: [ImagePickerComponent,CategoryPickerComponent],
})
export class GlobalModule {}