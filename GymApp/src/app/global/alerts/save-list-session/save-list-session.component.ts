import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ExerciseListService } from '../../services/Exercise/exercise-list.service';
import { Router } from '@angular/router';
import { ExerciseList } from '../../models/exercise-list.model';

@Component({
  selector: 'app-save-list-session',
  templateUrl: './save-list-session.component.html',
  styleUrls: ['./save-list-session.component.scss'],
})
export class SaveListSessionComponent {
  @Output() cancelButtonClicked = new EventEmitter<void>();
  @Output() okButtonClicked = new EventEmitter<void>();
  @Input() selectedList?: ExerciseList;

  constructor(
    private exerciseListService: ExerciseListService,
    private router: Router,
  ) { }

  public alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
      handler: () => {
        this.cancelButtonClicked.emit();
      },
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        this.okButtonClicked.emit();
        if(this.selectedList){
        this.exerciseListService.updateExerciseList(this.selectedList);
        }
        this.router.navigate(['/exercises/list']);
      },
    },
  ];

}
