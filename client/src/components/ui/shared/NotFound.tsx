import Link from "next/link";
import { Button } from "@/components/ui/shared/Button";

function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 gap-6"
      style={{ height: "calc(100vh - 64.8px)" }}
    >
      <span className="text-[10rem] leading-none font-extrabold drop-shadow-lg">
        404
      </span>

      <p className="text-xl md:text-3xl font-semibold drop-shadow-md">
        Chúng tôi không thể tìm thấy trang này!
      </p>

      <Link href="/">
        <Button size="lg" className="w-full sm:w-auto">
          Quay lại trang chủ
        </Button>
      </Link>
    </div>
  );
}

export default NotFound;
