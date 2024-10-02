import ActiveChat from "../../components/goals/ActiveChat";

const ChatPage = ({ params }: { params: { id: string } }) => {
  return <ActiveChat id={params.id} />;
};

export default ChatPage;
