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
export type User = {
  user_id : string;
}
export type MyEvent = {
  summary: string;
  description: string;
  location: string;
  start: string;
  end: string;
  reminders: {
    useDefault: boolean;
    overrides: [
      {
        method: "email",
        minutes: number;
      },
      {
        method: "popup",
        minutes: number;
      }
    ];
  },
  attendees: [];
}
  