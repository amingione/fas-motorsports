import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center text-white px-4"
      style={{
        backgroundImage: "url('/images/about page background FAS.png')",
      }}
    >
      <SignIn
        path="/sign-in"
        routing="path"
        signUpUrl="/sign-up"
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-primary hover:bg-white text-white hover:text-black font-ethno tracking-wider px-6 py-3 rounded-md transition duration-300 shadow-md",
            card:
              "bg-black text-white border border-white rounded-lg shadow-lg p-8 ring-1 ring-red-700/30",
            headerTitle:
              "text-primary font-captain text-2xl sm:text-xl tracking-widest mb-4",
            headerSubtitle:
              "text-accent text-sm mb-6",
            socialButtonsBlockButton:
              "bg-white hover:bg-primary text-black hover:text-white border border-white font-bold tracking-wider py-2 px-4 rounded transition duration-300",
            formFieldLabel:
              "text-white font-bold uppercase text-sm tracking-wider",
            footerAction:
              "text-white mt-4",
            identityPreview:
              "text-white",
            formFieldInput:
              "bg-black text-white border border-white focus:ring-primary px-4 py-2 rounded transition duration-300",
          },
        }}
      />
    </div>
  )
}