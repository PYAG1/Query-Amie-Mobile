export type Chat = {
    id: string;
    message: string;
    type: "user" | "ai";
  };


 export  type MessageBubbleProps = {
    message: string;
    isUser: boolean;
  };