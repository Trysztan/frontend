export class User {
    constructor(
        public id: number,
        public username: string,
        public email: string,
        public password: string,
        public height: number,
        public weight: number,
        public imagePath: string,
    ){}
}