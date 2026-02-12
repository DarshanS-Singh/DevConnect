import { useState, useRef, useEffect, useCallback } from "react"
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useDispatch } from "react-redux"
import { removeFeed } from "../utils/feedSlice"

const FeedCard = ({ user, preview }) => {
  const { _id, firstName, lastName, photoUrl, skills, about, age, gender } = user
  const dispatch = useDispatch()
  const cardRef = useRef(null)
  const startXRef = useRef(0)
  const currentXRef = useRef(0)
  
  const [currentX, setCurrentX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const SWIPE_THRESHOLD = 100 // Minimum distance to trigger swipe
  const ROTATION_FACTOR = 0.1 // Rotation multiplier

  const sendRequest = useCallback(async (status) => {
    if (isAnimating) return
    setIsAnimating(true)
    try {
      await axios.post(
        BASE_URL + "/request/sendConnectionRequest/" + status + "/" + _id,
        {},
        { withCredentials: true }
      )
      // Animate card out
      if (cardRef.current) {
        const direction = status === "interested" ? 1 : -1
        cardRef.current.style.transform = `translateX(${direction * 1000}px) rotate(${direction * 30}deg)`
        cardRef.current.style.opacity = "0"
        setTimeout(() => {
          dispatch(removeFeed(_id))
        }, 300)
      } else {
        dispatch(removeFeed(_id))
      }
    } catch (err) {
      console.error(err?.response?.data || err.message)
      setIsAnimating(false)
    }
  }, [_id, dispatch, isAnimating])

  const handleInterested = () => sendRequest("interested")
  const handleIgnored = () => sendRequest("ignored")

  // Touch handlers
  const handleTouchStart = (e) => {
    if (preview || isAnimating) return
    const touchX = e.touches[0].clientX
    startXRef.current = touchX
    setIsDragging(true)
  }

  const handleTouchMove = (e) => {
    if (preview || !isDragging || isAnimating) return
    const touchX = e.touches[0].clientX
    const deltaX = touchX - startXRef.current
    currentXRef.current = deltaX
    setCurrentX(deltaX)
    updateCardTransform(deltaX)
  }

  const handleTouchEnd = () => {
    if (preview || !isDragging || isAnimating) return
    handleSwipeEnd()
  }

  // Mouse handlers
  const handleMouseDown = (e) => {
    if (preview || isAnimating) return
    startXRef.current = e.clientX
    setIsDragging(true)
    e.preventDefault()
  }

 

  const updateCardTransform = (deltaX) => {
    if (!cardRef.current) return
    const rotation = deltaX * ROTATION_FACTOR
    cardRef.current.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`
    cardRef.current.style.transition = "none"
    
    // Update opacity based on swipe distance
    const opacity = 1 - Math.abs(deltaX) / 400
    cardRef.current.style.opacity = Math.max(0.5, opacity)
  }

  const resetCard = useCallback(() => {
    if (!cardRef.current) return
    cardRef.current.style.transition = "transform 0.3s ease-out, opacity 0.3s ease-out"
    cardRef.current.style.transform = "translateX(0) rotate(0deg)"
    cardRef.current.style.opacity = "1"
    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.style.transition = ""
      }
    }, 300)
  }, [])

  const handleSwipeEnd = useCallback(() => {
    if (!cardRef.current) return
    
    const absDeltaX = Math.abs(currentXRef.current)
    
    if (absDeltaX > SWIPE_THRESHOLD) {
      // Trigger swipe action
      if (currentXRef.current > 0) {
        // Swipe right = Interested
        sendRequest("interested")
      } else {
        // Swipe left = Ignored
        sendRequest("ignored")
      }
    } else {
      // Snap back to center
      resetCard()
    }
    
    setIsDragging(false)
    currentXRef.current = 0
    startXRef.current = 0
    setCurrentX(0)
  }, [resetCard, sendRequest])

 
 

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.transition = ""
      cardRef.current.style.transform = "translateX(0) rotate(0deg)"
      cardRef.current.style.opacity = "1"
    }
    setIsAnimating(false)
    setIsDragging(false)
    currentXRef.current = 0
    startXRef.current = 0
    setCurrentX(0)
  }, [_id])

  // Global mouse events for dragging (placed after handleSwipeEnd definition)
  useEffect(() => {
    if (isDragging && !preview) {
      const handleGlobalMouseMove = (e) => {
        if (isAnimating) return
        const deltaX = e.clientX - startXRef.current
        currentXRef.current = deltaX
        setCurrentX(deltaX)
        updateCardTransform(deltaX)
      }
      const handleGlobalMouseUp = () => {
        handleSwipeEnd()
      }
      
      document.addEventListener("mousemove", handleGlobalMouseMove)
      document.addEventListener("mouseup", handleGlobalMouseUp)
      
      return () => {
        document.removeEventListener("mousemove", handleGlobalMouseMove)
        document.removeEventListener("mouseup", handleGlobalMouseUp)
      }
    }
  }, [isDragging, preview, isAnimating, handleSwipeEnd])

  const skillList = Array.isArray(skills) ? skills : (skills ? [skills] : [])

  // Calculate overlay opacity and text
  const swipeDirection = currentX > 0 ? "right" : currentX < 0 ? "left" : null
  const overlayOpacity = Math.min(Math.abs(currentX) / SWIPE_THRESHOLD, 1)
  const showOverlay = Math.abs(currentX) > 20 && !isAnimating

  return (
    <div className="w-full mx-auto relative max-w-full sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl">
      {/* Swipe overlay indicators */}
      {showOverlay && !preview && (
        <>
          {swipeDirection === "right" && (
            <div
              className="absolute inset-0 rounded-2xl bg-dev-success/20 border-2 border-dev-success flex items-center justify-center z-10 pointer-events-none"
              style={{ opacity: overlayOpacity }}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">✓</div>
                <div className="text-dev-success font-bold text-lg">Interested</div>
              </div>
            </div>
          )}
          {swipeDirection === "left" && (
            <div
              className="absolute inset-0 rounded-2xl bg-red-500/20 border-2 border-red-500 flex items-center justify-center z-10 pointer-events-none"
              style={{ opacity: overlayOpacity }}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">✕</div>
                <div className="text-red-400 font-bold text-lg">Skip</div>
              </div>
            </div>
          )}
        </>
      )}

      <div
        ref={cardRef}
        className={`rounded-2xl overflow-hidden border border-dev-border bg-dev-surface shadow-xl ${
          !preview && !isAnimating ? "cursor-grab active:cursor-grabbing" : ""
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        style={{
          touchAction: preview ? "auto" : "pan-y",
          userSelect: preview ? "auto" : "none",
        }}
      >
        <div className="relative bg-dev-surface-elevated h-[85vh] sm:h-[70vh] lg:h-[72vh] xl:h-[75vh]">
          <img
            src={photoUrl}
            alt={`${firstName} ${lastName}`}
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
          />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dev-surface to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-2xl font-bold text-white drop-shadow">
              {firstName} {lastName}
            </h2>
            {(age || gender) && (
              <p className="text-gray-300 text-sm mt-0.5">
                {[age, gender].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>
        </div>
        <div className="p-6 space-y-4">
          {about && (
            <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">{about}</p>
          )}
          {skillList.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skillList.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-dev-accent/15 text-dev-accent border border-dev-accent/30"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
          {!preview && (
            <div className="flex gap-3 pt-2">
              <button
                className="btn btn-secondary flex-1 rounded-xl py-3 font-medium"
                onClick={handleIgnored}
                disabled={isAnimating}
              >
                Skip
              </button>
              <button
                className="btn btn-primary flex-1 rounded-xl py-3 font-semibold"
                onClick={handleInterested}
                disabled={isAnimating}
              >
                Interested
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Swipe hint */}
      {!preview && !isDragging && currentX === 0 && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-gray-500 text-xs text-center whitespace-nowrap">
          Swipe right for Interested • Swipe left for Skip
        </div>
      )}
    </div>
  )
}

export default FeedCard
