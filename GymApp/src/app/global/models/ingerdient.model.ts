
import { Recipe } from "./recipe.model";

export class Ingredient {
    constructor(
        public id: number,
        public quantity: number,
        public name: string,
        public unit_of_measure: string,
        public description: string,
        public recipe: Recipe,
    ){}
}