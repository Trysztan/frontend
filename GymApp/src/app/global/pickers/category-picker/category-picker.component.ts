import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PickerController } from '@ionic/angular';
import { ExerciseService } from '../../services/Exercise/exercise.service';

@Component({
  selector: 'app-category-picker',
  templateUrl: './category-picker.component.html',
  styleUrls: ['./category-picker.component.scss'],
})
export class CategoryPickerComponent  implements OnInit {
  @Input() categories: Array<string> = [];
  @Input() buttontext="";
  @Output() selectedCategory = new EventEmitter<string>();

  constructor(
    private pickerCtrl: PickerController,
    private exerciseService: ExerciseService,
  ) { }

  ngOnInit() {
  }

  async showPicker() {
    const picker = await this.pickerCtrl.create({
      columns: [
        {
          name: 'exerciseCategory',
          options: this.getOptions(), 
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Select',
          handler: (value) => {
            this.selectedCategory.emit(value.exerciseCategory.value);
            console.log('Kiválasztott érték:', value.exerciseCategory.value);
          },
        },
      ],
    });

    await picker.present();
  }

  getOptions() {
    const options = [];
    for (const key in this.categories) {
        options.push({
          text: this.categories[key],
          value: this.categories[key],
        });
    }
    return options;
  }
  
}



