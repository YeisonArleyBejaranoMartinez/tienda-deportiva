"use client";
import { changeUserRole } from "@/src/actions/users/change-user-role";
import { User } from "@/src/interfaces";
interface Props {
    user: User[]
}

export const UsersTable = ({ user }: Props) => {
  return (
    <table className="min-w-full">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Email
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Nombre completo
              </th>
              <th
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Role
              </th>
            </tr>
          </thead>
          <tbody>
            {user.map((user) => (
              <tr key={user.email}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.email}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.name}
                </td>
                <td className="flex items-center text-sm  text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                <select
                    value={user.role}
                    className="text-sm text-gray-900 w-full padding-2"
                    onChange={(e)=>{changeUserRole(user.id, e.target.value)}}
                    >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                </td>

              </tr>
            ))}
          </tbody>
    </table>
  )
}
