import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';


import { ImagePickerComponent } from './pickers/image-picker/image-picker.component';
import { CategoryPickerComponent } from './pickers/category-picker/category-picker.component';
import { LeaveComponent } from './alerts/leave/leave.component';
import { SaveListSessionComponent } from './alerts/save-list-session/save-list-session.component';

@NgModule({
  declarations: [
    ImagePickerComponent,
    CategoryPickerComponent,
    LeaveComponent,
    SaveListSessionComponent,
  ],
  imports: [CommonModule, IonicModule],
  exports: [ImagePickerComponent,CategoryPickerComponent,LeaveComponent,SaveListSessionComponent],
})
export class GlobalModule {}