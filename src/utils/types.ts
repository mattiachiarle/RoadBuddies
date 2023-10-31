export type Message = {
  content: string;
  user_id: string;
};
export type Trip = {
  id: number;
  startDate: string;
  endDate: string;
  vehicle: string;
  participants: string[];
};
export type Todo = {
  id: number;
  content: string;
  checked: boolean;
};
