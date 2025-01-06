
import {setUserProfile } from "@/redux/authSlice";
import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"


const useGetUserProfile = (userId) => {
    const dispatch = useDispatch();
    // const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    useEffect(() => {
        setLoading(true);
      setError(null);
        const fetchUserProfile = async () => {
          try {
            const res = await axios.get(`http://localhost:8080/api/v1/user/${userId}/profile`, { withCredentials: true });
      
            if (res.data.success) {
                dispatch(setUserProfile(res.data.user));
            }
          } catch (error) {
            setError(error.response?.data?.message || "Error fetching user profile");
          } finally {
            setLoading(false);
          }
        };
        fetchUserProfile();
    }, [userId, dispatch]);
    return { loading, error };
      
//  useEffect(() => {
//     const fetchUserProfile  = async () => {
//         try {
//             const res = await axios.get(`http://localhost:8080/api/v1/user/${userId}/profile`, {withCredentials:true});

//             if(res.data.success) {
//                 // console.log(res.data.posts)
//                 dispatch(setUserProfile(res.data.user));
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }
//     fetchUserProfile();
//  },[userId])
}

export default useGetUserProfile

