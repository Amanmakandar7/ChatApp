<img width="1452" height="828" alt="Screenshot 2025-09-27 123605" src="https://github.com/user-attachments/assets/2c2e5045-de8d-411a-8f73-4300bf38eac6" />

#chatapp

<!-- A real-time chat application built using React + vite and redux.  
This project demonstrates front-end development skills, React component architecture, and integration with real-time messaging features. --> 

## Features

Real-time messaging :
                     Users can send and receive messages instantly, providing a smooth and interactive chat experience

User authentication:
                    Secure login and registration functionality ensures that each user has a protected account.


Responsive design for desktop and mobile:
                    The interface adapts seamlessly to different screen sizes, giving an optimal experience on any device.

Built with React + redux + vite:
                    Leveraging React’s component-based architecture and Vite’s fast development server for efficient and modern web development.

Modern UI with clean design:
                    A simple and elegant user interface focused on usability and a pleasant user experience.


## Installation

1. Clone the repository:    
            git clone https://github.com/Amanmakandar7/ChatApp.git

2. Navigate to the project folder:
            cd ChatApp

3. Install dependencies :
        npm install

4> Start the development server:
        npm run dev


## Technologies Used

React – for building UI components

redux - for better satate management

Vite – development build tool for fast refresh

CSS/Tailwind – for styling


## Folder / Component Structure

## Folder / Component Structure

 **ChatApp/src/Components/Chatroom/Chatroom.jsx**  
  The main chatroom component that renders the chat interface, handles sending messages, and displays all active conversations.

 **ChatApp/src/Components/Chatroom/Message.jsx**  
  Represents an individual message in the chat, including sender name, message content, and timestamp.

 **ChatApp/src/Pages/Dashboard.jsx**  
  The main dashboard page of the application, displaying the chatroom and user-specific details like online status and recent chats.

 **ChatApp/src/Slice/authSlice.jsx**  
  Redux slice that manages authentication and chat state, including logged-in user data, messages, and other global state.

 **ChatApp/src/Store/store.jsx**  
  Configures the Redux store, combines slices, and provides the global state to the React application.

 **ChatApp/src/Components/Login.jsx**  
  Handles user login functionality with form validation, authentication logic, and redirection after successful login.

 **ChatApp/src/App.jsx**  
  The root React component that sets up routing, layouts, and renders all main components of the application.

 **ChatApp/src/main.jsx**  
  The entry point of the React app, responsible for rendering `<App />` into the DOM and initializing the application.



##How throttling, pagination, infinite scroll, and form validation are implemented:


1. Throttling

Throttling limits how often a function can run over time to improve performance.

Example in ChatApp: Throttling user typing notifications or API calls while sending messages.

Implemented using JavaScript’s setTimeout or libraries like lodash.throttle to avoid excessive re-renders or network requests.

2. Pagination

Pagination divides content into pages to reduce load times and improve performance.

Example: Loading older chat messages in batches instead of all at once.

Implemented by fetching a fixed number of messages per request and providing “Next” or “Load More” functionality.

3. Infinite Scroll

Infinite scroll automatically loads more content as the user scrolls down.

Example: Chat history loads dynamically as the user scrolls up in the chat window.

Implemented by detecting scroll position with an event listener and fetching more messages when the user reaches the top.

4. Form Validation

Form validation ensures user inputs are correct before submission.

Example: Login and signup forms validate email, password, and required fields.

Implemented using React state, event handlers, and libraries like Yup or simple custom validation functions to show error messages instantly.


##screenshots

<img width="1452" height="828" alt="Screenshot 2025-09-27 123605" src="https://github.com/user-attachments/assets/fe58c1a6-3bd8-4b66-a256-4c6b70cd06aa" />

<img width="1349" height="805" alt="Screenshot 2025-09-27 123627" src="https://github.com/user-attachments/assets/23ed44db-7cf6-4c0f-ac45-8ecada13235d" />

<img width="1263" height="807" alt="Screenshot 2025-09-27 123712" src="https://github.com/user-attachments/assets/caadc073-0600-4a22-809f-fbaf62cc4676" />

<img width="1298" height="843" alt="Screenshot 2025-09-27 123820" src="https://github.com/user-attachments/assets/6c05b012-98ef-4559-8ca3-52972fda5df1" />

<img width="1903" height="759" alt="Screenshot 2025-09-27 123840" src="https://github.com/user-attachments/assets/6f4da75e-75fc-4a82-b0d0-b03904cf0147" />

<img width="1920" height="792" alt="Screenshot 2025-09-27 123921" src="https://github.com/user-attachments/assets/09a5f172-e957-453b-9934-324cc7ed5e16" />

<img width="1920" height="902" alt="Screenshot 2025-09-27 123945" src="https://github.com/user-attachments/assets/6e03f7ec-93b4-4905-9bef-43b666e9791c" />

<img width="1920" height="854" alt="Screenshot 2025-09-27 123958" src="https://github.com/user-attachments/assets/36790d4f-55cf-44fe-856a-edecb7792f2e" />
