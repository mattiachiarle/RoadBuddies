import { useContext, useEffect, useState } from "react";
import AppContext from "../context/appContext";
import { Message } from "../utils/types";
import "../utils/css/chat.css";
import { useParams } from "react-router-dom";
import { Button, Input } from "@nextui-org/react";
import { getPayingUser, queryChatGpt, getUpdatedTodo } from "../API.js";

function Chat({ email }) {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [channel, setChannel] = useState(undefined);
  const supabase = useContext(AppContext);
  const { tripId } = useParams();

  useEffect(() => {
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
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("group_id", tripId)
          .order("created_at", { ascending: true });
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
    <div style={{display:"flex", flexDirection:"column", gap:"1rem", padding:"2%"}}>
      {messages.map((message,idx) =>(
        message.user_id === currentUser? 
        (
          <div style={{display:"flex", flexDirection:"row-reverse"}}>
            <span style={{borderRadius:" 20px",backgroundColor: "#e6f7ff", maxWidth:"80%",  padding:"8px"}}>{message.user_id}: {message.content}</span>
          </div>
        )   
        :
        (
          <div style={{display:"flex", flexDirection:"row"}}>
            <span style={{borderRadius:"20px",backgroundColor: "#f2f2f2", maxWidth:"80%", padding:"8px"}}>{message.user_id}: {message.content}</span>
          </div>
        )
         ))}
    </div>
  );
  /*Remember to display in a different way user's messages and received messages*/
}

function InputBox(props) {
  const [message, setMessage] = useState<string>("");
  const supabase = useContext(AppContext);
  const { tripId } = useParams();

  const onSend = async (message: string) => {
    if (message) {
      try {
        const { error } = await supabase.from("messages").insert({
          user_id: props.username,
          content: message,
          group_id: props.group,
        });

        if (error) {
          throw error;
        } else {
          setMessage("");
        }

        // if (message == "@chatgpt who pays?") {
        //   const payingUser = await getPayingUser(tripId);
        //   const { error } = await supabase.from("messages").insert({
        //     user_id: props.username,
        //     content: payingUser,
        //     group_id: props.group,
        //   });
        //   if (error) {
        //     throw error;
        //   }
        // }

        if (message.startsWith("@chatgpt")) {
          const response_message = await queryChatGpt(
            message.split("@chatgpt")[1]
          );
          const { error } = await supabase.from("messages").insert({
            user_id: props.username,
            content: response_message,
            group_id: props.group,
          });
          if (error) {
            throw error;
          }
        }

        if (error) {
          throw error;
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const askWhoPays = async () => {
    try {
      {
        const { error } = await supabase.from("messages").insert({
          user_id: props.username,
          content: "@chatgpt who pays?",
          group_id: props.group,
        });

        if (error) {
          throw error;
        } else {
          setMessage("");
        }
      }

      const payingUser = await getPayingUser(tripId);
      const { error } = await supabase.from("messages").insert({
        user_id: props.username,
        content: payingUser,
        group_id: props.group,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const askTodo = async () => {
    try {
      {
        const { error } = await supabase.from("messages").insert({
          user_id: props.username,
          content: "@chatgpt what's missing from the todo list?",
          group_id: props.group,
        });

        if (error) {
          throw error;
        } else {
          setMessage("");
        }
      }

      const todos = await getUpdatedTodo(tripId);
      const { error } = await supabase.from("messages").insert({
        user_id: props.username,
        content: todos,
        group_id: props.group,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeMessage = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(ev.target.value);
  };
  return (
    <div className="input-container" style={{display:"flex", flexDirection:"column", gap:"1rem"}}>
      <Input
        type="text"
        value={message}
        onChange={changeMessage}
        placeholder="Type a message..."
        onKeyDown={event => {
          if (event.key === 'Enter') {
            onSend(message);
            event.preventDefault(); // Prevents the addition of a new line in the input after pressing 'Enter'
          }
        }}
      />
      <div style={{display:"flex", flexDirection:"row", gap:"1rem"}}>
      <Button
        variant="ghost"
        color="success"
        onClick={() => {
          onSend(message);
        }}
      >
        Send
      </Button>
      <Button
        variant="ghost"
        color="warning"
        onClick={() => {
          askWhoPays();
        }}
      >
        Who pays?
      </Button>
      <Button
      variant="ghost"
      color="warning"
        onClick={() => {
          askTodo();
          }}
        >
        What's missing from the To-do list?
      </Button> 
      </div>
      <div style={{color:"GrayText"}}>
          You can ask anything to chatgpt by writing a message starting with
          @chatgpt in the chat!
      </div>
    </div>
  );
}
export default Chat;
