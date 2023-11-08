import { Ingredient } from "./ingerdient.model";
import { NutritionFacts } from "./nutrition-facts.model";
import { User } from "./user.model";

export class Recipe{
    constructor(
        public id: number,
        public name: string,
        public serving: number,
        public ingredients: Array<Ingredient>,
        public creator: User,
        public nutritionFacts: NutritionFacts, 
        public directions?: Array<string>
    ){}
}