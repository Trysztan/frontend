import { User } from "./user.model";

export class Exercise {
    constructor(
        public id: number,
        public name: string,
        public first_category: string,
        public pr: number,
        public creator: User,
        public second_category: string,
        public repetitions: number,
        public sets: number,
        public weight?: number,
        public distance?: number,

    ){}
}