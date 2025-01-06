/* eslint-disable no-unused-vars */
import {useEffect, useState} from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { toast } from 'sonner'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '@/redux/authSlice'

const Login = () => {
    const [input, setinput] = useState({
        email:"",
        password:""
    });
    const [loading, setLoading] = useState(false)
    const {user} = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const changeEventHandler = (e) => {
        setinput({ ...input, [e.target.name]: e.target.value });
    }
    const signupHandler = async(e) => {
        e.preventDefault();
        console.log(input)
        try {
            setLoading(true)
            const res = await axios.post("http://localhost:8080/api/v1/user/login", input, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
        
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user))
                navigate("/");
                toast.success(res.data.message);
                setinput({
                    email:"",
                    password:""
                });
            }
        } catch (error) {
            console.log(error);
        
            if (error.response) {
                // Server responded with a status code
                toast.error(error.response.data?.message || "An error occurred.");
            } else if (error.request) {
                // Request was made but no response received
                toast.error("No response from server. Please try again.");
            } else {
                // Something else happened during the request setup
                toast.error("An unexpected error occurred.");
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(user) {
            navigate("/")
        }
    },[]);
  return (
    <div className='flex items-center w-screen h-screen justify-center'>
        <form className='shadow-lg flex flex-col gap-5 p-8 ' onSubmit={signupHandler} >
            <div className='my-4 '>
                <h1 className='text-center font-bold text-xl'>LOGIN</h1>
                <p className='text-sm text-center'>Login to see photos and videos from your friends</p>
            </div>

            <div>
                <Label className="py-1">Email</Label> 
                <Input type="text" name="email" className='focus-visible:ring-transparent my-2'
                  value={input.email}
                  onChange={changeEventHandler}
                />
            </div>

            <div>
                <Label className="py-1">Password</Label> 
                <Input type="text" name="password" className='focus-visible:ring-transparent my-2'
                  value={input.password}
                  onChange={changeEventHandler}
                />
            </div>

            {
                loading ? (
                    <Button>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin'></Loader2>
                    </Button>
                ) : (
                    <Button type="submit">Login</Button>
                )
            }

            <span className='text-center'>Don &nbsp; t have an account? <Link to="/signup" className='text-blue-600'>Register</Link></span>
        </form>
    </div>
  )
}

export default Login
