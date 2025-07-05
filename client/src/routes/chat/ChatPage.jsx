import { useParams } from "react-router-dom";
import Chat from "../../components/chat/Chat";

function ChatPage() {
  const { receiverId } = useParams();

  return (
    <div>
      <Chat receiverId={receiverId} />
    </div>
  );
}

export default ChatPage;