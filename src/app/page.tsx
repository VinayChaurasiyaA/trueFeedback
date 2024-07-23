import { Button } from "@/components/ui/button";
// import Image from "next/image";
import Link from "next/link";
// import { ModeToggle } from "@/components/Theme/Theme";

export default function Home() {
  return (
    <div className="bg-gray-700 text-secondary-foreground min-h-screen flex items-center justify-center">
      {/* <ModeToggle /> */}
      <div className="max-w-md mx-auto p-8 bg-secondary shadow-md shadow-black rounded-md">
        <h1 className="text-2xl font-bold mb-4">Welcome to TrueFeedback</h1>
        <p className="text-secondary-foreground">
          TrueFeedback is a platform that allows you to share your thoughts and
          opinions anonymously. With TrueFeedback, you can express yourself
          freely without the fear of being judged or identified. Your identity
          is kept completely anonymous, ensuring that your feedback is honest
          and unbiased.
        </p>
        <p className="text-secondary-foreground mt-4">
          Start sharing your feedback today and join our community of anonymous
          voices!
        </p>

        <Button className="mt-2 bg-secondary text-secondary-foreground shadow-lg shadow-black hover:text-black">
          <Link href="/sign-up">Create your own account</Link>
        </Button>
      </div>
    </div>
  );
}
