
import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"


const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();
 useEffect(() => {
    const fetchSugestedUsers  = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/v1/user/suggested", {withCredentials:true});

            if(res.data.success) {
                // console.log(res.data.posts)
                dispatch(setSuggestedUsers(res.data.users));
            }
        } catch (error) {
            console.log(error)
        }
    }
    fetchSugestedUsers();
 },[])
}

export default useGetSuggestedUsers
