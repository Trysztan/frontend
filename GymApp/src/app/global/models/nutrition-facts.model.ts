import { Recipe } from "./recipe.model";

export class Exercise {
    constructor(
        public id: number,
        public calories: number,
        public fat: number,
        public carbs: number,
        public protein: number,
        public recipe: Recipe,
    ){}
}