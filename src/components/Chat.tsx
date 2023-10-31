import { useEffect, useState } from "react";
import AppContext from "../context/appContext";
import { Message } from "../utils/types";
import {Button, Form} from "react-bootstrap";
import '../utils/css/chat.css'

function Chat(props) {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [channel, setChannel] = useState(undefined);
  const { supabase } = useContext(AppContext);
  useEffect(() => {
    /** only create the channel if we have a roomCode and username */
    if (props.group.id && props.user.username) {
      /**
       * Step 1:
       *
       * Create the supabase channel for the roomCode, configured
       * so the channel receives its own messages
       */
      const channel = supabase.channel(`group:${props.group.id}`, {
        config: {
          broadcast: {
            self: true,
          },
        },
      });

      /**
       * Step 2:
       *
       * Listen to broadcast messages with a `message` event
       */
      channel.on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `group_id=eq.${props.group.id}`,
        },
        ({ payload }) => {
          setMessages((messages: Array<Message>) => [...messages, payload]);
        }
      );

      /**
       * Step 3:
       *
       * Subscribe to the channel
       */
      channel.subscribe();

      /**
       * Step 4:
       *
       * Set the channel in the state
       */
      setChannel(channel);

      const getInitialMessages = async () => {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("group_id", groupId)
          .order("timestamp", { ascending: true });
        if (error) {
          console.log(error);
        }
        setMessages(data);
      };

      getInitialMessages();

      return () => {
        channel.unsubscribe();
        setChannel(undefined);
      };
    }
  }, []);

  return (
    <div className="chat-container">
      <Messages messages={messages} currentUser={props.user.username} />
      <InputBox />
    </div>
  );
}

function Messages({ messages, currentUser }) {
  return (
    <div className="message-container">
      {messages.map((message, idx) => (
        <div
          key={idx}
          className={`message ${
            message.sender === currentUser ? "self" : "other"
          }`}
        >
          <span className="sender">{message.sender}:</span> {message.content}
        </div>
      ))}
    </div>
  );
  /*Remember to display in a different way user's messages and received messages*/
}

function InputBox() {
  const [message, setMessage] = useState<Message>();
  const onSend = async (message: string | undefined) => {
    if(message){
      try{
        const { data, error } = await supabase.from("messages").upsert([message]);
      }catch(error){
        console.log(error);
      }
    }
  };
  const changeMessage = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const newMessage = {
      content: ev.target.value,
      sender: props.user.username,
    }
    setMessage(newMessage);
  };
  return(
    <Form className="input-container" onSubmit={(e) => {e.preventDefault();onSend(message?.content) }}>
      <Form.Group className="mb-4">
        <Form.Label>Message</Form.Label>
        <Form.Control type="text" value={message?.content} onChange={changeMessage} placeholder="Type a message..." />
      </Form.Group>
      <Form.Group>
        <Button variant="success" onClick={()=>{onSend(message?.content)}}>Send</Button>{' '}
      </Form.Group>
    </Form>
  );
}
export default Chat;
