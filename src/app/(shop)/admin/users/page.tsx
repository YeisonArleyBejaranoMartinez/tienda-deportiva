export const revalidate = 0;
import { Title } from "@/src/components";
import { redirect } from "next/navigation";
import { UsersTable } from "./ui/UsersTable";
import { getPaginatedUsers } from "@/src/actions/users/get-paginater-users";

export default async function Orders() {
  const { ok, users=[] } = await getPaginatedUsers();
  if (!ok) {
    redirect("/auth/login");
  }
  return (
    <>
      <Title title="Lista de usuarios" />
      <div className="mb-10">
        <UsersTable user={users} />

      </div>
    </>
  );
}
