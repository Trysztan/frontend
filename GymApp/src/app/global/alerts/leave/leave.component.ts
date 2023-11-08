import { Component, EventEmitter, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExerciseListService } from '../../services/Exercise/exercise-list.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss'],
})
export class LeaveComponent {
  @Output() cancelButtonClicked = new EventEmitter<void>();
  @Output() okButtonClicked = new EventEmitter<void>();


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
        this.exerciseListService.deleteSession()
        this.router.navigate(['/exercises/list']);
      },
    },
  ];

}