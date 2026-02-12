import { Outlet, useLocation } from "react-router-dom"
import NavBar from "./NavBar"
import Footer from "./Footer"
import { BASE_URL } from "../utils/constants"
import { useDispatch, useSelector } from "react-redux"
import { addUser } from "../utils/userSlice"
import { useEffect } from "react"
import axios from "axios"

const Body = () => {
  const dispatch = useDispatch()
  const user = useSelector((store) => store.user)
  const location = useLocation()
  const hideFooterPaths = ["/", "/profile", "/connections", "/requests"]
  const showFooter = !hideFooterPaths.includes(location.pathname)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(BASE_URL + "/profile/getProfile", {
          withCredentials: true,
        })
        dispatch(addUser(res.data))
      } catch (err) {
        console.log(err?.response?.status)
      }
    }
    if (!user) fetchUser()
  }, [user, dispatch])

  return (
    <div className="flex flex-col min-h-screen bg-dev-bg">
      <NavBar />
      <main className="flex-grow">
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  )
}

export default Body
