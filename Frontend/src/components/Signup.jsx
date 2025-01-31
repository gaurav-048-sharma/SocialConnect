/* eslint-disable no-unused-vars */
import React, {useEffect, useState} from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { toast } from 'sonner'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useSelector } from 'react-redux'

const Signup = () => {
    const [input, setinput] = useState({
        username:"",
        email:"",
        password:""
    });
    const [loading, setLoading] = useState(false);
    const {user} = useSelector(store => store.auth)
    const navigate = useNavigate();
    const changeEventHandler = (e) => {
        setinput({ ...input, [e.target.name]: e.target.value });
    }
    const signupHandler = async(e) => {
        e.preventDefault();
        // navigate("/login")
        console.log(input)
        try {
            setLoading(true)
            const res = await axios.post("http://localhost:8080/api/v1/user/register", input, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
        
            if (res.data.success) {
                navigate("/login")
                toast.success(res.data.message);
                setinput({
                    username:"",
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
        },[])

  return (
    <div className='flex items-center w-screen h-screen justify-center'>
        <form className='shadow-lg flex flex-col gap-5 p-8 ' onSubmit={signupHandler} >
            <div className='my-4 '>
                <h1 className='text-center font-bold text-xl'>SIGN UP</h1>
                <p className='text-sm text-center'>Signup to see photos and videos from your friends</p>
            </div>
            <div>
                <Label className="py-1">Username</Label> 
                <Input type="text" 
                   name="username" 
                   className='focus-visible:ring-transparent my-2'
                   value={input.username}
                   onChange={changeEventHandler}
                />
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
                <Button disabled>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please wait...
                </Button>
            ) : (
                <Button type="submit">Sign Up</Button>
            )
            }
            <span className='text-center'>Already have an account? <Link to="/login" className='text-blue-600'>login</Link></span>
        </form>
    </div>
  )
}

export default Signup
