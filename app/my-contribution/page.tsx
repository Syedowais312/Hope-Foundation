import Link from "next/link";

export default function MyContribution() {
  return <>
  <h1>This is the My Contribution Page</h1>;
  <Link href="/"><button className="w-full py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
             > go back to home</button></Link>
  </>
  
}
