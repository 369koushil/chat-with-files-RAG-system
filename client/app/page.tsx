import Fileuploadcomponent from "./components/Fileuploadcomponent";
import ChatComponent from "./components/ChatComponent";
export default function Home() {

  return (
    <div className="w-screen h-screen flex  ">
      <div className="h-full w-[25%] flex justify-center items-center">
      <Fileuploadcomponent/>
      </div>
      <div className="h-full w-[75%] border-white border-2">
       <ChatComponent/>
       </div>
    </div>
  );
}
