import '../styles/Estados.css'

export default function EmptyState({ children }) {
  return <p className="estado" role="status">{children}</p>
}
