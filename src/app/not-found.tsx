import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap flex flex-col items-center py-28 text-center">
      <p className="caps text-gold">404</p>
      <h1 className="display mt-4 text-[46px] md:text-[64px]">Хуудас олдсонгүй</h1>
      <div className="rule mt-6 w-40">
        <span className="diamond" />
      </div>
      <p className="mt-6 max-w-md text-[16px] text-ink-2">Хайсан бүтээгдэхүүн дууссан эсвэл хаяг өөрчлөгдсөн байж магадгүй.</p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn btn-ink">
          Цуглуулга
        </Link>
        <Link href="/" className="btn btn-line">
          Нүүр
        </Link>
      </div>
    </div>
  );
}
