export type Message = {
    content: string;
    sender: string;
};
export type Trip = {
    id: number;
    startDate: string;
    endDate: string;
    vehicle: string;
    participants: string[];
};