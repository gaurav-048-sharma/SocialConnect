// import { Avatar } from '@radix-ui/react-avatar'
// import React from 'react';
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { AvatarFallback, AvatarImage, Avatar } from "./ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { useState } from "react";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

function LeftSidebar() {
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const logoutHandler = async () => {
    console.log("Logout handler triggered");
    //Uncomment the code below after verifying the sidebar click works.
    try {
      const res = await axios.get("http://localhost:8080/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success("Logged out successfully");
        console.log("Logout handler triggered");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  // const createPostHandler = () => {
  //     setOpen(true);
  // }

  const sidebarHandler = (textType) => {
    // alert(textType);
    if (textType === "Logout") {
      logoutHandler();
    } else if (textType === "Create") {
      setOpen(true);
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Messages") {
      navigate("/chat");
    } 
    // } else {
    //     toast.info(`Navigating to ${textType}`);
    //     // Handle navigation or other actions for other sidebar items
    // }
  };
  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar>
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];
  return (
    // <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
    //     <div className='flex flex-col'>
    //         <h2>LOGO</h2>

    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col">
        <h1 className="my-8 pl-3 font-bold text-xl">LOGO</h1>
        <div>
          {sidebarItems.map((item, index) => (
            <div
              className="flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 m-3"
              onClick={() => sidebarHandler(item.text)}
              key={index}
            >
              {item.icon}
              <span>{item.text}</span>
              {item.text === "Notifications" && likeNotification.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      size="icon"
                      className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6"
                    >
                      {likeNotification.length}
                    </Button>
                  </PopoverTrigger>
                  {/* <PopoverContent>
                    <div className="max-h-60 overflow-y-auto">
                      {!likeNotification || likeNotification.length === 0 ? (
                        <p>No new notification</p>
                      ) : (
                        likeNotification.map((notification) => (
                          <div
                            key={notification.userId}
                            className="flex items-center gap-2 py-2"
                          >
                            <Avatar>
                              <AvatarImage
                                src={notification.userDetails?.profilePicture}
                              />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <p className="text-sm">
                              <span className="font-bold">
                                {notification.userDetails?.username}
                              </span>{" "}
                              liked your post
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </PopoverContent> */}

                  <PopoverContent>
                                                    <div>
                                                        {
                                                            likeNotification.length === 0 ? (<p>No new notification</p>) : (
                                                                likeNotification.map((notification) => {
                                                                    return (
                                                                        <div key={notification.userId} className="flex items-center gap-2 my-2">
                                                                            <Avatar>
                                                                                <AvatarImage src={notification.userDetails?.profilePicture}/>
                                                                                <AvatarFallback>CN</AvatarFallback>
                                                                            </Avatar>
                                                                            <p className='text-sm'> <span className='font-bold'>{notification.userDetails?.username} </span>liked your post</p>
                                                                        </div>
                                                                    )
                                                                })
                                                            )
                                                        }
                                                    </div>
                                                </PopoverContent>
                </Popover>
              )}
            </div>
          ))}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
    </div>
  );
}

export default LeftSidebar;

// import {Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp  } from 'lucide-react'

// import { AvatarFallback, AvatarImage, Avatar } from './ui/avatar'

// const sidebarItems = [
//     {icon: <Home/>,text:"Home" },
//     {icon: <Search/>,text:"Search" },
//     {icon: <TrendingUp/>,text:"Explore" },
//     {icon: <MessageCircle/>,text:"Messages" },
//     {icon: <Heart/>,text:"Notifications" },
//     {icon: <PlusSquare/>,text:"Create" },
//     {icon: (
//         <Avatar>
//             <AvatarImage src="https://github.com/shadcn.png" />
//             <AvatarFallback>CN</AvatarFallback>
//         </Avatar>
//     ),text:"Profile"
// },
// {icon: <LogOut/>,text:"Logout" }
// ]

// const LeftSidebar = () => {
//   return (
//     <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
//         <div className='flex flex-col'>
//             <h1>LOGO</h1>
//             <div>
//             {
//                 sidebarItems.map((item, index) => {
//                     return (
//                         <div key={index} className='flex items-center gap-4 relative'>
//                             {item.icon}
//                             <span>{item.text}</span>
//                         </div>
//                     )
//                 } )
//             }
//             </div>
//         </div>

//     </div>
//   )
// }

// export default LeftSidebar
