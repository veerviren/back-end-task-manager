export interface Task {
    userId: string
    name: string;
    description?: string;
    dueDate?: Date;
}