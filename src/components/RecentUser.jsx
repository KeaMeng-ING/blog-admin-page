import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { useEffect, useState } from "react";

export default function RecentUsers() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://blog-backend-a3p6.onrender.com/api/admin/recentUser"
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  });

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.email} className="flex items-center gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={user.imageUrl || "/placeholder.svg"}
              alt={user.name}
              className="object-cover"
            />
            {/* <AvatarFallback>{user.name.charAt(0)}</AvatarFallback> */}
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm  font-medium leading-none">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {user.createdAgo}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
