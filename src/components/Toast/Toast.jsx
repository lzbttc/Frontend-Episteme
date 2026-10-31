import { CheckCircleIcon } from '../icons'
import './Toast.css'

function Toast({ message, type = 'success', onClose }) {
  if (!message) return null

  return (
    <div className={`toast toast--${type}`} role="status" aria-live="polite">
      <span className="toast__icon">
        <CheckCircleIcon size={18} />
      </span>
      <span className="toast__message">{message}</span>
      {onClose && (
        <button
          type="button"
          className="toast__close"
          onClick={onClose}
          aria-label="Fechar notificação"
        >
          ×
        </button>
      )}
    </div>
  )
}

export default Toast
