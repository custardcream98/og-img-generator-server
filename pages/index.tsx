import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>SERVER IS ON</h1>
      <Link href={"/sample"}>샘플 보기</Link>
    </div>
  );
}
