import { Link, useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "./ui/button"
import { useRef, useState } from "react"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Loader2 } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { setAuthUser } from "@/redux/authSlice"


const EditProfile = () => {
    const imageRef = useRef();
    const {user} = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        profilePhoto: user?.profilePicture,
        bio:user?.bio,
        gender:user?.gender
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if(file) setInput({...input, profilePhoto:file});
    }

    const selectChangeHandler = (value) => {
        setInput({...input, gender:value});
    }

    const editProfileHandler =async  () => {
        const formData = new FormData();
        formData.append("bio", input.bio);
        formData.append("gender", input.gender);
        
        if(input.profilePhoto) {
            formData.append("profilePhoto", input.profilePhoto);
        }
        try {
            setLoading(true);
            const res = await axios.post("http://localhost:8080/api/v1/user/profile/edit", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials:true
            });
            if(res.data.success) {
                const updatedUserData = {
                    ...user,
                    bio:res.data.user?.bio,
                    profilePicture: res.data.user?.profilePicture,
                    gender:res.data.user?.gender
                };
                dispatch(setAuthUser(updatedUserData));
                navigate(`/profile/${user?._id}`)
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.res.data.message)
        } finally {
            setLoading(false);
        }
    }
  return (
    <div className="flex max-w-2xl mx-auto pl-10">
      <section className="flex flex-col gap-6 w-full my-8">
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
            <div className="flex items-center gap-3">
                <Link to={`/profile/${user?._id}`}>
                    <Avatar>
                        <AvatarImage src={user?.profilePicture} alt="post_image" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </Link> 
                <div >
                    <h1 className="font-bold text-sm">{user?.username}</h1>
                    <span className="text-gray-600 ">{user?.bio || "bio here"}</span>
                </div>
          </div>

          <input ref={imageRef} onChange={fileChangeHandler} type="file" className="hidden"/>
          <Button onClick={() => imageRef?.current.click()} className="bg-[#0095F6] h-8 hover:bg-[#318bc7]">Change Photo</Button>
        </div>
        <div>
            <h1 className="font-semibold text-xl mb-2">Bio</h1>
            <Textarea value={input.bio} onChange={(e) => setInput({...input, bio:e.target.value})} name='bio' className="w-full h-32 p-4 focus-visible:ring-transparent " placeholder="Tell us about yourself"/>
        </div>
        <div>
            <h1 >Gender</h1>
            <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
                    <SelectTrigger className="w-full">
                            <SelectValue/>
                    </SelectTrigger>
                        <SelectContent>
                            <SelectGroup >
                    
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            
                            </SelectGroup>
                         </SelectContent>
            </Select>
        </div>
        <div className="flex justify-end">
            {
                loading ? (
                    <Button className="w-fit bg-[#0095F6] hover:bg-[#449eda]">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                        Please wait...
                    </Button>
                ) : (
                    <Button onClick={editProfileHandler} className="w-fit bg-[#0095F6] hover:bg-[#449eda]">Submit</Button>
                )
            }
            
        </div>
      </section>
    </div>
  )
}

export default EditProfile