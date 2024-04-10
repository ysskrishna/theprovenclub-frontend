import React, {useEffect, useState} from 'react'
import config from '../../config';
import Swal from 'sweetalert2';

const EventType = {
  CHECKOUT:"CHECKOUT",
  RETURN: "RETURN"
}

var todayDate = new Date().toISOString().slice(0, 10);

const Home = () => {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(todayDate);
  
  const fetchBooks = () => {
    const myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
  
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
  
    fetch(`${config.baseUrl}/book/?skip=0&limit=100`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("books result", result);
        if (result?.result) {
          setBooks(result?.result);
        }
      })
      .catch((error) => console.error(error));
  }

  const fetchMembers = () => {
    const myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
  
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
  
    fetch(`${config.baseUrl}/member/?skip=0&limit=100`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log("members result", result);
        if (result?.result) {
          setMembers(result?.result);
        }
      })
      .catch((error) => console.error(error));
  }


  useEffect(()=> {
    fetchBooks()
    fetchMembers()
  },[]);

  const get_event_api_url = (event_type) => {
    if (event_type == EventType.RETURN) {
      return "/circulation/return";
    } else {
      return "/circulation/checkout";
    }
  }


  const handleButtonClick = (book_id, event_type = EventType.CHECKOUT) => {
    console.log(selectMember, book_id, event_type);
    if (!!selectMember && !! selectedDate) {
      let url = get_event_api_url(event_type)

      const myHeaders = new Headers();
      myHeaders.append("accept", "application/json");
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        "parameter": {
          "book_id": book_id,
          "member_id": selectMember,
          "date": selectedDate
        }
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };

      fetch(`${config.baseUrl}${url}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log("result", result);
          setLoading(false);

          Swal.fire({
            title: "Success",
            text: result?.message,
            icon: "success"
          });
        })
        .catch((error) => {
          console.error(error)
          setLoading(false);
          Swal.fire({
            title: "Failed",
            text: "Some internal error! please try later",
            icon: "error"
          });
        });
    } else {
      if (!selectedDate){
        Swal.fire({
          title: "Failed",
          text: "Please select a date",
          icon: "error"
        });
      }
      else if (!selectMember) {
        Swal.fire({
          title: "Failed",
          text: "Please select a member",
          icon: "error"
        });
      }
    }
  }

  console.log("date", selectedDate);

  if (loading) {
    return (
      <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
      </svg>
    )
  }

  return (
    <div>
      <h1>Library</h1>
      
      <div class="max-w-2xl mx-auto">

	    <label for="members" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">Select a member</label>
      <select id="members" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" onChange={e=> setSelectedMember(e.target.value)}>
        <option selected>Choose a member</option>
        {members?.map((item, index)=> {
          return (
          <option value={item.member_id}>{item?.member_name}</option>
          )
        })}
    </select>


      <input type="date" id="date" name="trip-start" value={selectedDate} onChange={(e)=> setSelectedDate(e.target.value)} min={todayDate} />

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
      {
      books?.map((book, index) => {
        return ( 
          <div class="relative mx-auto w-full">
          <a href="#" class="relative inline-block duration-300 ease-in-out transition-transform transform hover:-translate-y-2 w-full">
            <div class="shadow p-4 rounded-lg bg-white">
        
            <div class="mt-4">
              <h2 class="font-medium text-base md:text-lg text-gray-800 line-clamp-1" title="New York">
              {book?.book_name}
              </h2>
            </div>
            
            <div class="grid grid-cols-2 mt-8">
            <button
                class="middle none center mr-4 rounded-lg bg-blue-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                data-ripple-light="true"
                onClick={()=> handleButtonClick(book?.book_id, EventType.CHECKOUT)}
              >
                Checkout
              </button>
              <button
                class="middle none center mr-4 rounded-lg bg-red-500 py-3 px-6 font-sans text-xs font-bold uppercase text-white shadow-md shadow-red-500/20 transition-all hover:shadow-lg hover:shadow-red-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                data-ripple-light="true"
                onClick={()=> handleButtonClick(book?.book_id, EventType.RETURN)}
              >
                Return
              </button>
            </div>
            </div>
          </a>
          </div>
        )
      })
      }
    </div>
    </div>
  </div>
  )
}

export default Home


