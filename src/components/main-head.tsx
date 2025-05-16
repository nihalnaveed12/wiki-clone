import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function WikipediaHeader() {
  return (
    <div className="max-w-7xl pt-10 mx-auto border-b border-gray-300 px-2">
      <div className="flex gap-3 justify-between">
        {/* Left navigation */}
        <div className="">
          <Link href="#" className="py-2 font-medium">
            Main Page
          </Link>
        </div>

        {/* Right side - Add article button */}
        <div className="flex items-center gap-2 pb-4">
          <Link href={"/add-article"}>
          <Button
            variant="outline"
            className="cursor-pointer flex items-center gap-1 rounded border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            <Plus className="h-4 w-4" />
            Add article
          </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
