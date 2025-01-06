import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { useSelector } from "react-redux"
import useGetAllMessage from "@/hooks/useGetAllMessage"
import useGetRTM from "@/hooks/useGetRTM"
// import { useEffect } from "react"


const Messages = ({selectedUser}) => {
  useGetRTM();
  useGetAllMessage();
  const {messages} = useSelector(store => store.chat);
  const {user} = useSelector(store => store.auth);
  // useEffect(() => {
  //   // Scroll to the last message whenever the messages array changes
  //   if (messages?.length > 0) {
  //     setTimeout(() => {
  //       lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  //     }, 100);
  //   }
  // }, [messages]);
  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center ">
        <div className="flex flex-col items-center justify-center">
        <Avatar className="h-20 w-20">
          <AvatarImage src={selectedUser?.profilePicture} alt="profile"/>
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span>{selectedUser?.username}</span>
        <Link to={`/profile/${selectedUser?._id}`}><Button className="h-8 my-2" variant="secondary">View Profile</Button></Link>
        </div>
        
      </div>
      <div className="flex flex-col gqp-3">
        {
         messages&& messages.map((msg) => {
            return (
              <div key={msg} className={`flex ${msg.senderId === user?._id ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-2 rounded-lg max-w-xss break-words mb-2 ${msg.senderId === user?._id ?  'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                  {msg.message}
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Messages