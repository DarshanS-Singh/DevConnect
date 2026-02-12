import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Body from './components/Body'
import Login from './components/Login'
import Profile from './components/Profile'
import BasePage from './components/BasePage'
import Feed from './components/Feed'
import { useSelector } from "react-redux"
import Connections from './components/Connections'
import Requests from './components/Requests'


const App = () => {

  const user = useSelector(store => store.user)
  
  return <>
    <BrowserRouter basename='/' >
      <Routes>
        <Route path="/" element = {<Body/>}>
          <Route path='/' element = {user ? <Feed/> : <BasePage/>} />
          <Route path="/login" element = {<Login/>} />
          <Route path="/profile" element = {<Profile/>}/>
          <Route path="/connections" element = {<Connections/>}/>
          <Route path="/requests" element = {<Requests/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
    
  </>
}

export default App