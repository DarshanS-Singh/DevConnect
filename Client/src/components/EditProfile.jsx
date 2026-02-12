import { useState } from "react"
import FeedCard from "./FeedCard"
import axios from "axios"
import { BASE_URL } from "../utils/constants"
import { useDispatch } from "react-redux"
import { addUser } from "../utils/userSlice"

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName ?? "")
  const [lastName, setLastName] = useState(user.lastName ?? "")
  const [error, setError] = useState("")
  const [age, setAge] = useState(user.age ?? "")
  const [about, setAbout] = useState(user.about ?? "")
  const [gender, setGender] = useState(user.gender ?? "")
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl ?? "")
  const [skills, setSkills] = useState(
    Array.isArray(user.skills) ? user.skills.join(", ") : user.skills ?? ""
  )
  const [toast, setToast] = useState(null)
  const [saving, setSaving] = useState(false)
  const dispatch = useDispatch()

  const showToast = (type, duration = 3000) => {
    setToast(type)
    setTimeout(() => setToast(null), duration)
  }

  const handleEdit = async () => {
    setError("")
    setSaving(true)
    try {
      const skillsArr = Array.isArray(skills)
        ? skills
        : typeof skills === "string"
          ? skills.split(",").map((s) => s.trim()).filter(Boolean)
          : []
      const res = await axios.patch(
        BASE_URL + "/profile/editUserProfile",
        {
          firstName,
          lastName,
          age: age ? Number(age) : undefined,
          about,
          gender,
          photoUrl,
          skills: skillsArr,
        },
        { withCredentials: true }
      )
      dispatch(addUser(res.data.data))
      showToast("success")
    } catch (err) {
      setError(err?.response?.data || "Something went wrong.")
      showToast("error")
    } finally {
      setSaving(false)
    }
  }

  const previewUser = {
    firstName,
    lastName,
    photoUrl,
    about,
    age: age || undefined,
    gender,
    skills: typeof skills === "string" ? skills.split(",").map((s) => s.trim()).filter(Boolean) : skills,
  }

  if (!user) return null

  return (
    <div className="min-h-[calc(100vh-180px)] py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Form */}
        <div className="w-full max-w-md rounded-2xl border border-dev-border bg-dev-surface p-6 lg:p-8">
          <h1 className="text-xl font-bold text-white mb-6">Edit profile</h1>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">First name</label>
                <input
                  type="text"
                  className="input input-bordered w-full rounded-lg bg-dev-surface-elevated border-dev-border"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Last name</label>
                <input
                  type="text"
                  className="input input-bordered w-full rounded-lg bg-dev-surface-elevated border-dev-border"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Photo URL</label>
              <input
                type="url"
                className="input input-bordered w-full rounded-lg bg-dev-surface-elevated border-dev-border"
                placeholder="https://..."
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">About</label>
              <input
                type="text"
                className="input input-bordered w-full rounded-lg bg-dev-surface-elevated border-dev-border"
                placeholder="A short bio"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Skills (comma-separated)</label>
              <input
                type="text"
                className="input input-bordered w-full rounded-lg bg-dev-surface-elevated border-dev-border"
                placeholder="React, Node, Python"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Age</label>
                <input
                  type="number"
                  min="18"
                  className="input input-bordered w-full rounded-lg bg-dev-surface-elevated border-dev-border"
                  placeholder="18+"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Gender</label>
                <input
                  type="text"
                  className="input input-bordered w-full rounded-lg bg-dev-surface-elevated border-dev-border"
                  placeholder="e.g. male, female"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                />
              </div>
            </div>
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3">
                {error}
              </div>
            )}
            <button
              className="btn btn-primary w-full rounded-xl py-3 font-semibold mt-2"
              onClick={handleEdit}
              disabled={saving}
            >
              {saving ? <span className="loading loading-spinner loading-sm" /> : "Save profile"}
            </button>
          </div>
        </div>

        {/* Live preview */}
        <div className="w-full max-w-md shrink-0">
          <p className="text-sm text-gray-500 mb-3">Preview</p>
          <FeedCard user={previewUser} preview />
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          {toast === "success" && (
            <div className="rounded-xl bg-dev-success/20 border border-dev-success/30 text-dev-success px-6 py-3 font-medium shadow-lg">
              Profile updated
            </div>
          )}
          {toast === "error" && (
            <div className="rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-3 font-medium shadow-lg">
              Update failed
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default EditProfile
