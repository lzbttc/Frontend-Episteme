import { useEffect, useRef } from 'react'
import './Modal.css'

function Modal({
  isOpen,
  onClose,
  title,
  children,
  triggerRef,
  className = '',
  'aria-describedby': ariaDescribedBy,
}) {
  const modalRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return

    // Save previous overflow style and lock body scroll
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Focus into modal
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstFocusable = focusableElements?.[0]
    firstFocusable?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose?.()
      } else if (event.key === 'Tab') {
        // Trap focus inside modal
        if (!focusableElements || focusableElements.length === 0) return
        const first = focusableElements[0]
        const last = focusableElements[focusableElements.length - 1]

        if (event.shiftKey) {
          if (document.activeElement === first) {
            last.focus()
            event.preventDefault()
          }
        } else {
          if (document.activeElement === last) {
            first.focus()
            event.preventDefault()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    const triggerElement = triggerRef?.current
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      // Return focus to trigger button
      triggerElement?.focus()
    }
  }, [isOpen, onClose, triggerRef])

  if (!isOpen) return null

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.()
        }
      }}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={ariaDescribedBy}
        className={`modal ${className}`}
      >
        <div className="modal__header">
          <h2 id="modal-title" className="modal__title">
            {title}
          </h2>
          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label="Fechar modal"
          >
            ×
          </button>
        </div>
        <div className="modal__content">{children}</div>
      </div>
    </div>
  )
}

export default Modal
