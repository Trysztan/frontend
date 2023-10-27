import { Exercise } from "./exercise.model";

export class ExerciseList {
    constructor(
        public name: string,
        public first_category: string,
        public second_category: string,
        public creator_id: number,
        public exercises: Array<Exercise>
    ){}
}