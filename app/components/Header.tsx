import { getAgencySession } from "@/lib/server-api";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const session = await getAgencySession();
  return <HeaderClient agencyName={session.user?.agency.company_name ?? null} clearInvalidSession={session.invalid} />;
}
