import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Logout() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/')
    }, 0.5000) 
    return () => clearTimeout(timer)
  }, [])

  return 
}
