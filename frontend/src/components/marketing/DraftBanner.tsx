const DraftBanner = () => {
  return (
    <div className="draft-banner border-b border-amber-400/40 bg-amber-950/80 text-amber-100">
      <p className="container mx-auto px-6 py-2 text-sm">
        Internal review draft. Do not publish. Text in [BRACKETS] is still unconfirmed.
      </p>
    </div>
  )
}

export default DraftBanner
