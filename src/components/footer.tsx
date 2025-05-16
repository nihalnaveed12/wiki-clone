import Image from "next/image"
import Link from "next/link";

export default function Footer() {
  return (
    <div className="flex items-center max-w-2xl mx-auto gap-2 flex-col py-4">
        <Image alt="About wikipedia" height={1000} width={1000} src={"/images/logo.png"} className="w-[50px]"/>
      <p className=" text-zinc-500 text-center">
        Wikipedia is hosted by the Wikimedia Foundation, a non-profit
        organization that also hosts a range of other projects.
      </p>
      <Link href={"/"} className="text-blue-600 hover:text-blue-500">You can support
        our work with a donation.</Link>
    </div>
  );
}
