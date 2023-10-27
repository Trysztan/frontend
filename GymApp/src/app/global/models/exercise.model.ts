export class Exercise {
    constructor(
        public name: string,
        public first_category: string,
        public pr: number,
        public creator_id: number,
        public second_category: string,
        public rep: number,
        public set: number,
        public weight?: number,
        public distance?: number,

    ){}
}