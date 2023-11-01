export type Message = {
  content: string;
  user_id: string;
};
export type Trip = {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  vehicle: string;
  start: string;
  destination: string;
};
export type Todo = {
  id: number;
  content: string;
  checked: boolean;
  user: string;
};
