import SEO from '@/components/SEO'

const Index = () => {
  return (
    <>
      <SEO
        title="Dolonia Data Tech"
        description="Dolonia builds websites, databases, automation and private AI for business and government, then hosts and runs them."
        url="https://dolonia.cloud/"
      />
      <iframe
        title="Dolonia"
        src="/ocean/index.html"
        className="block h-screen w-screen border-0 bg-[#041018]"
      />
    </>
  )
}

export default Index
