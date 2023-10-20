import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistPageRoutingModule } from './regist-routing.module';

import { RegistPage } from './regist.page';
import { GlobalModule } from 'src/app/global/global.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    GlobalModule,
    RegistPageRoutingModule
  ],
  declarations: [RegistPage]
})
export class RegistPageModule {}
