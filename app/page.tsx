import UserInformation from "@/components/UserInformation";
import Image from "next/image";
export default function Home() {
  return (
    <main className="">
      <section>
        <UserInformation />
      </section>
      <section>
        {/* PostForm */}
        {/* PostFeed */}
      </section>
      <section>{/* Widget */}</section>
    </main>
  );
}
