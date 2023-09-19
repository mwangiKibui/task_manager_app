"use client";

import React,{useState,useEffect} from 'react';





function Tasks({status = "all"}) {

const [loading,setLoading] = useState(false);
const [tasks,setTasks] = useState([]);
const [error,setError] = useState('');

useEffect( () => {
    setLoading(true);
    let authToken = localStorage.getItem('auth_token');
    let userDets = JSON.parse(localStorage.getItem('user_details'));
    try{
        
        fetch(
            `http://profiletasks.sandbox.co.ke:8989/task/user/${userDets.id}`,
            {
                method:"GET",
                headers:{
                    'content-type':"application/json",
                    'Authorization':`Bearer ${authToken}`
                }
            }
        )
        .then(response => response.json())
        .then(data => {
            let isSuccessful = Array.isArray(data) ? true : false;
            if(isSuccessful){   
                setLoading(false);
                setError("");
                if(status == "all"){
                    setTasks(data);
                }else if(status == "pending"){
                    setTasks(data.filter(el => el.status == 1));
                }else if(status == "in_progress"){
                    setTasks(data.filter(el => el.status == 2));
                }else if(status == "completed"){
                    setTasks(data.filter(el => el.status == 3));
                }else{
                    setTasks(data);
                }
            }else{
                setError("Cannot fetch your tasks at this moment. Try refreshing.");
            }
        });
    }catch(erorr){
        setError("An error occurred processing request : " + error);
    }
},[status]);

  const handleToProgress = async (id,e) => {
    if(id){
        e.target.innerHTML = "Updating...";
        try{
            let authToken = localStorage.getItem('auth_token');
            let response = await fetch(
                'http://profiletasks.sandbox.co.ke:8989/task/update',
                {
                    method:"POST",
                    body:JSON.stringify({
                        id,
                        status:'2'
                    }),
                    headers:{
                        'content-type':'application/json',
                        'Authorization':`Bearer ${authToken}`
                    }
                }
            );

            response = await response.json();

            if(response.hasOwnProperty("id")){

                if(status == "all"){
                    setTasks(tasks.map((task,i) => {
                        if(task.id == id){
                            return {
                                ...task,
                                status:2
                            }
                        }else{
                            return {
                                ...task
                            }
                        }
                    }));
                }else{
                    // filter out the tasks.
                    setLoading(true);
                    setTasks(tasks.filter((el,i) => el.id !== id));
                    setLoading(false);
                }
            }else{
                setError("An error occurred updating task: "+response.message);
                e.target.innerHTML = "Mark as In Progress";
            }
        }catch(error){
            e.target.innerHTML = "Mark as In Progress";
            setError("An error occurred updating task: "+error);
        }
        
    }else{
        setError("You must select a task");
    }
  };

  const handleToCompleted = async (id,e) => {
    if(id){
        e.target.innerHTML = "Updating...";
        try{
            let authToken = localStorage.getItem('auth_token');
            let response = await fetch(
                'http://profiletasks.sandbox.co.ke:8989/task/update',
                {
                    method:"POST",
                    body:JSON.stringify({
                        id,
                        status:'3'
                    }),
                    headers:{
                        'content-type':'application/json',
                        'Authorization':`Bearer ${authToken}`
                    }
                }
            );

            response = await response.json();

            if(response.hasOwnProperty("id")){
                if(status == "all"){
                    setTasks(tasks.map((task,i) => {
                        if(task.id == id){
                            return {
                                ...task,
                                status:3
                            }
                        }else{
                            return {
                                ...task
                            }
                        }
                    }));
                }else{
                    // filter out the tasks.
                    setLoading(true);
                    setTasks(tasks.filter((el,i) => el.id !== id));
                    setLoading(false);
                }
            }else{
                setError("An error occurred updating task: "+response.message);
                e.target.innerHTML = "Mark as Completed";
            }
        }catch(error){
            e.target.innerHTML = "Mark as Completed";
            setError("An error occurred updating task: "+error);
        }
        
    }else{
        setError("You must select a task");
    }
  };

  const handleDeleteTask = async (id,e) => {
    if(id){
        e.target.innerHTML = "Deleting...";
        try{
            let authToken = localStorage.getItem('auth_token');
            let response = await fetch(
                'http://profiletasks.sandbox.co.ke:8989/task/delete',
                {
                    method:"POST",
                    body:JSON.stringify({
                        id
                    }),
                    headers:{
                        'content-type':'application/json',
                        'Authorization':`Bearer ${authToken}`
                    }
                }
            );

            response = await response.json();

            if(response.hasOwnProperty("successful") && response.successful){
                // filter out the tasks.
                setLoading(true);
                setTasks(tasks.filter((el,i) => el.id !== id));
                setLoading(false);
            }else{
                setError("An error occurred deleting task: "+response.message);
                e.target.innerHTML = "Delete Task";
            }
        }catch(error){
            e.target.innerHTML = "Delete Task";
            setError("An error occurred updating task: "+error);
        }
        
    }else{
        setError("You must select a task");
    }
  }
  return (
    <div>
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
        {
            loading ? (
                <p>Loading...</p>
            ): (
                tasks.map((task,i ) => (
                    <div key={i}>
                        <div className="block max-w p-6 mt-3 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                            
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{task.title}</h5>
                            
                            <p className="font-normal text-gray-700 dark:text-gray-400">{task.content}</p>

                            <div className='mt-2'>

                            
                            {
                                task.status == "1" && (
                                    <button 
                                        type="button" 
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        onClick={ (e) => handleToProgress(task.id,e)}
                                    >
                                        Mark as In Progress
                                        {/* <svg class="w-3.5 h-3.5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 21">
                                            <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z"/>
                                        </svg> */}
                                        
                                    </button>
                                )
                            }

                            {
                                task.status == "2" && (
                                    <button 
                                        type="button" 
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        onClick={(e) => handleToCompleted(task.id,e)}
                                    >
                                        Mark as Completed
                                        {/* <svg class="w-3.5 h-3.5 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 21">
                                            <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z"/>
                                        </svg> */}
                                        
                                    </button>
                                )
                            }
                            
                            

                            <button 
                                type="button" 
                                className="text-white bg-red-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                onClick={(e) => handleDeleteTask(task.id,e)}
                            >
                                Delete Task
                                {/* <svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                                </svg> */}
                            </button>

                            
                            </div>

                        </div>
                    </div>
                ))
            )
        }
    </div>
  )
}

export default Tasks