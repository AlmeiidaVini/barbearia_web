import '../styles/Estados.css'

export default function ErrorState({ children, onRetry }) {
  return (
    <div className="estado estado-erro">
      <p role="alert">{children}</p>
      {onRetry && <button type="button" onClick={onRetry}>Tentar novamente</button>}
    </div>
  )
}
