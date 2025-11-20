import { useEffect } from 'react'

const Toast = ({ message, type = 'error', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
      type === 'error' ? 'bg-red-600' : 'bg-green-600'
    } text-white animate-slide-in`}>
      {message}
    </div>
  )
}

export default Toast

