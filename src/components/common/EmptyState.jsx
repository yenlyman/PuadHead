import emptyStateIllustration from '../../assets/empty-state.svg'

function EmptyState({ message }) {
  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <img src={emptyStateIllustration} alt="" className="w-40 h-auto" />
      <p className="text-text-secondary">{message}</p>
    </div>
  )
}

export default EmptyState
