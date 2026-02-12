import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState, useCallback } from "react"
import { addFeed } from "../utils/feedSlice"
import FeedCard from "./FeedCard"

const Feed = () => {
  const feed = useSelector((store) => store.feed)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false)

  const getFeed = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get(BASE_URL + "/user/feed", { withCredentials: true })
      dispatch(addFeed(res?.data?.data ?? []))
    } catch (err) {
      console.log(err)
      dispatch(addFeed([]))
    } finally {
      setLoading(false)
    }
  }, [dispatch])

  useEffect(() => {
    if (!feed?.length) getFeed()
  }, [feed?.length, getFeed])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-180px)] flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 rounded-full border-4 border-dev-accent/30 border-t-dev-accent animate-spin mb-6" />
        <p className="text-gray-400">Loading developers...</p>
      </div>
    )
  }

  if (!loading && (!feed || feed.length === 0)) {
    return (
      <div className="min-h-[calc(100vh-180px)] flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4">👋</div>
        <h2 className="text-xl font-semibold text-white mb-2">No one left to discover</h2>
        <p className="text-gray-400 max-w-sm mb-6">
          You’ve seen everyone in your feed. Check back later or find more below.
        </p>
        <button className="btn btn-primary rounded-xl" onClick={getFeed}>
          Find more developers
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center py-4 px-2 sm:px-4 pb-8">
      <FeedCard user={feed[0]} />
    </div>
  )
}

export default Feed
