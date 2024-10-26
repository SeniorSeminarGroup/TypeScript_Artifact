export interface Task {
    id: string;
    title: string;
    completed: boolean;
    createdAt: Date;
    color: string;
};

export class hardTask implements Task {
    id: string;
    title: string;
    completed: boolean;
    createdAt: Date;
    color: string = "#e12a2a"
    
    constructor (id: string, title: string, completed: boolean, createdAt: Date){
        this.id=id
        this.title=title
        this.completed=completed
        this.createdAt=createdAt
    }
}
export class mediumTask implements Task {
    id: string;
    title: string;
    completed: boolean;
    createdAt: Date;
    color: string = "#fad02c"
    
    constructor (id: string, title: string, completed: boolean, createdAt: Date){
        this.id=id
        this.title=title
        this.completed=completed
        this.createdAt=createdAt
    }
}
export class easyTask implements Task {
    id: string;
    title: string;
    completed: boolean;
    createdAt: Date;
    color: string = "#469a49"
    
    constructor (id: string, title: string, completed: boolean, createdAt: Date){
        this.id=id
        this.title=title
        this.completed=completed
        this.createdAt=createdAt
    }
}