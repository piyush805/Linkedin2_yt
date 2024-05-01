import PostForm from "@/components/PostForm";
import UserInformation from "@/components/UserInformation";
export default function Home() {
  return (
    <main className="grid grid-cols-8 mt-5 sm:px-5">
      <section className="hidden md:inline md:col-span-2">
        <UserInformation />
      </section>
      <section className="col-span-full md:col-span-6 xl:col-span-4 xl:max-w-xl mx-auto w-full">
        <PostForm />
        {/* PostFeed */}
      </section>
      <section>{/* Widget */}</section>
    </main>
  );
}
