"use client"
import React,{useState,useEffect} from 'react';
import { useRouter } from 'next/navigation'

function Register() {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [firstName,setFirstName] = useState('');
  const [lastName,setLastName] = useState('');
  const [phoneNumber,setPhoneNumber] = useState('');
  const [error,setError] = useState("");

  const router = useRouter();

  useEffect( () => {
    // check if the user was authenticated...
    let user = localStorage.getItem('auth_token');
    if(user){
        // clear the current user.
        localStorage.clear();
    }else{

    }
  },[]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(email && password && firstName &&  lastName &&  phoneNumber){
        setError("");
        try{
            let response = await fetch(
                'http://profiletasks.sandbox.co.ke:8989/register',
                {
                    method:"POST",
                    body:JSON.stringify({
                        email,
                        password,
                        firstName,
                        lastName,
                        phoneNumber
                    }),
                    headers:{
                        'content-type':'application/json'
                    }
                }
            );

            response = await response.json();
            
            if(response.hasOwnProperty('id')){

                // reset the values.
                setEmail("");
                setPassword("");
                setFirstName("");
                setLastName("");
                setPhoneNumber("");
                setError("");

                // redirect to home page.
                router.push('/login');

            }else{
                // alert the user of the error that occurred.
                setError("An error occurred processing request: " + response.error);
                return;
            }
        }catch(error){
            console.log("the error ",error);
            setError("An error occurred processing request : " + error);
            return;
        }
    }else{
        setError("All fields are required");
        return;
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Task Manager App
                    </h1>
                    {
                        error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <strong className="font-bold">Error: </strong>
                                <span className="block sm:inline">{error}.</span>
                                <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                    <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                                </span>
                            </div>
                        )
                    }
                    <form className="space-y-4 md:space-y-6" action="#" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                            <input 
                                type="firstName" 
                                name="firstName" 
                                id="firstName" 
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                placeholder="Your first name" 
                                required={true}
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                            <input 
                                type="lastName" 
                                name="lastName" 
                                id="lastName" 
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                placeholder="Your last name" 
                                required={true}
                            />
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
                            <input 
                                type="phoneNumber" 
                                name="phoneNumber" 
                                id="phoneNumber" 
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                placeholder="Your phone number" 
                                required={true}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                            <input 
                                type="email" 
                                name="email" 
                                id="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                placeholder="Your email address" 
                                required={true}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password" 
                                placeholder="••••••••" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                required={true}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Sign up
                        </button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Already have an account? <a href="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Register;