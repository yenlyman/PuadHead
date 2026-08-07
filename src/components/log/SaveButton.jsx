function SaveButton({ onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-xl bg-primary py-3 font-medium text-white disabled:opacity-50"
    >
      บันทึก
    </button>
  )
}

export default SaveButton
