import { Exercise } from "./exercise.model";
import { User } from "./user.model";

export class ExerciseList {
    constructor(
        public id:number,
        public name: string,
        public first_category: string,
        public second_category: string,
        public creator: User,
        public exercises: Array<Exercise>
    ){}
}