import { useContext, useEffect, useState } from "react";
import AppContext from "../context/appContext";
import { Message, NewMessage } from "../utils/types";
import {Button, Form, Row} from "react-bootstrap";
import "../utils/css/chat.css";
import { useParams } from "react-router-dom";

function Chat({ email }) {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [channel, setChannel] = useState(undefined);
  const supabase = useContext(AppContext);
  const { tripId } = useParams();
  // console.log(supabase);

  useEffect(() => {
    console.log(tripId);
    console.log(email);
    /** only create the channel if we have a roomCode and username */
    if (tripId && email) {
      /**
       * Step 1:
       *
       * Create the supabase channel for the roomCode, configured
       * so the channel receives its own messages
       */
      const channel = supabase.channel(`group:${tripId}`, {
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
          filter: `group_id=eq.${tripId}`,
        },
        (res) => {
          console.log(res.new.user_id);
          const newMessage: Message = {
            content: res.new.content,
            user_id: res.new.user_id,
          };
          setMessages((messages: Array<Message>) => [...messages, newMessage]);
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
        const session = await supabase.auth.getSession();
        console.log(session);
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("group_id", tripId)
          .order("created_at", { ascending: true });
        if (error) {
          console.log(error);
        }
        console.log(data);
        setMessages(data);
      };

      getInitialMessages();

      return () => {
        channel.unsubscribe();
        setChannel(undefined);
      };
    }
  }, [tripId, email]);

  return (
    <div className="chat-container">
      <Messages messages={messages} currentUser={email} />
      <InputBox username={email} group={tripId} />
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
            message.user_id === currentUser ? "self" : "other"
          }`}
        >
          <span className="sender">{message.user_id}:</span> {message.content}
        </div>
      ))}
    </div>
  );
  /*Remember to display in a different way user's messages and received messages*/
}

function InputBox(props) {
  const [message, setMessage] = useState<string>("");
  const supabase = useContext(AppContext);

  const onSend = async (message: string) => {
    if (message) {
      try {
        const { data, error } = await supabase.from("messages").insert({
          user_id: props.username,
          content: message,
          group_id: props.group,
        });

        if (error) {
          throw error;
        } else {
          setMessage("");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const changeMessage = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(ev.target.value);
  };
  return (

     <Form
         className="input-container"
         onSubmit={(e) => {
           e.preventDefault();
           onSend(message);
         }}
     >
       <Row>
         <Form.Group className="mb-4">
           <Form.Label></Form.Label>
           <Form.Control
               type="text"
               value={message}
               onChange={changeMessage}
               placeholder="Type a message..."
           />
         </Form.Group>
         <Form.Group>
           <Button
               variant="success"
               onClick={() => {
                 onSend(message);
               }}
           >
             Send
           </Button>{" "}
         </Form.Group>
       </Row>

     </Form>


  );
}
export default Chat;
