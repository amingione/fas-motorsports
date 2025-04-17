import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white px-4">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: "btn btn-primary font-ethno tracking-wide px-6 py-3 rounded-md shadow-md",
            card: "bg-black text-white border border-white rounded-lg shadow-lg p-8 ring-1 ring-red-700/30",
            headerTitle: "text-primary font-captain text-xl tracking-widest mb-4",
          }
        }}
      />
    </div>
  )
}