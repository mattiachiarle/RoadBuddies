import { useEffect, useState } from "react";
import { useAppContext } from "../context/appContext";

function Chat(props) {
  const [messages, setMessages] = useState([]);
  const [channel, setChannel] = useState(undefined);
  const { supabase } = useAppContext();

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
          setMessages((messages) => [...messages, payload]);
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
    <>
      <Messages messages={messages} />
      <InputBox />
    </>
  );
}

function Messages() {
  /*Remember to display in a different way user's messages and received messages*/
}

function InputBox() {
  const onSend = async (message) => {
    const { data, error } = await supabase.from("messages").upsert([message]);
  };
}

export default Chat;
