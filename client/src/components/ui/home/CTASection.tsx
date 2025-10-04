import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/shared/Button";

const ArrowRight = dynamic(() =>
  import("lucide-react").then((mod) => mod.ArrowRight),
);

export default function CTASection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br bg-blue-50 from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">
          Sẵn sàng trải nghiệm dịch vụ chăm sóc sức khỏe chất lượng?
        </h2>
        <p className="text-xl mb-8">
          Tham gia cùng hàng nghìn bệnh nhân tin tưởng Bệnh viện MediCare cho
          nhu cầu chăm sóc sức khỏe của họ.
        </p>
        <Link href="/register">
          <Button size="lg">
            Đăng ký ngay hôm nay
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
