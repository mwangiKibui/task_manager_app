"use client"
import React,{useState,useEffect} from 'react';
import { useRouter } from 'next/navigation'

function AddTask() {
  const [title,setTitle] = useState('');
  const [content,setContent] = useState('');
  const [status,setStatus] = useState('');
  const [priority,setPriority] = useState('');
  const [error,setError] = useState("");

  const statusOptions = [
    {
        "id": 1,
        "name":"Pending"
    },
    {
        "id": 2,
        "name":"In Progress"
    },
    {
        "id": 3,
        "name":"Completed"
    },
   ];

   const priorityOptions = [
        {
            "id":1,
            "name":"High"
        },
        {
            "id":2,
            "name":"Moderate"
        },
        {
            "id":3,
            "name":"Low"
        },
   ];

  const router = useRouter();
  useEffect( () => {
    // check if user is logged in.
    let isLoggedIn = localStorage.getItem('auth_token') ? 1 : 0;
    if(isLoggedIn){

    }else{
        router.push('/login');
    }
  },[]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(title && content && status &&  priority){
        setError("");
        try{
            let userDets = JSON.parse(localStorage.getItem('user_details'));
            let userAuthToken = localStorage.getItem('auth_token');
            let response = await fetch(
                'http://profiletasks.sandbox.co.ke:8989/task/create',
                {
                    method:"POST",
                    body:JSON.stringify({
                        title,
                        content,
                        status,
                        priority,
                        userId:userDets.id
                    }),
                    headers:{
                        'content-type':'application/json',
                        'Authorization': `Bearer ${userAuthToken}`
                    }
                }
            );

            response = await response.json();
            
            if(response.hasOwnProperty('id')){

                // reset the values.
                setTitle("");
                setContent("");
                setStatus("");
                setPriority("");
                setError("");

                // redirect to home page.
                router.push('/');

            }else{
                // alert the user of the error that occurred.
                setError("An error occurred processing request: " + response.error);
                return;
            }
        }catch(error){
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
                            <label htmlFor="Title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title of the Task</label>
                            <input 
                                type="title" 
                                name="title" 
                                id="title" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                placeholder="Task Title" 
                                required={true}
                            />
                        </div>
                        <div>
                            <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Describe task</label>
                            <textarea 
                                id="content" 
                                rows="4" 
                                onChange={e => setContent(e.target.value)}
                                value={content}
                                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                placeholder="Write your thoughts here..."
                            ></textarea>

                        </div>
                        <div>
                            <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">What is the status</label>
                            <select 
                            id="status" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onChange={e => setStatus(e.target.value) }
                            >
                                {
                                    !status ? <option defaultValue>Choose the status option</option> : <option>Choose the status option</option>
                                }
                            
                                {
                                    statusOptions.map((el,i) => {
                                        if(status && el.id == status){
                                           return( <option defaultValue key={i} value={el.id}>{el.name}</option>);
                                        }else{
                                           return( <option key={i} value={el.id}>{el.name}</option>);
                                        }
                                    })
                                }
                            </select>
                        </div>
                        <div>
                            <label htmlFor="priority" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">What is the priority</label>
                            <select 
                            id="priority" 
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            onChange={e => setPriority(e.target.value)}
                            >
                            {
                                !priority ? <option defaultValue>Choose the priority option</option> : <option>Choose the priority option</option>
                            }
                            {
                                priorityOptions.map((el,i) => {
                                    if(priority && el.id == priority) {
                                        return (<option defaultValue key={i} value={el.id}>{el.name}</option>);
                                    }else{
                                        return (<option key={i} value={el.id}>{el.name}</option>);
                                    }
                                })
                            }
                            </select>
                        </div>
                        <button 
                            type="submit" 
                            className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Add Task
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </section>
  )
}

export default AddTask;