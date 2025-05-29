import {
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  UserPlus,
  Mail,
  UserCog,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import axios from "axios";

export default function UsersPage() {
  // State variables
  const [users, setUsers] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const usersPerPage = 5;

  //TODO: add loading

  // Fetch users with pagination and filters
  useEffect(() => {
    const fetchUsersOverview = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/users/useroverview"
        );
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user overview:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Add pagination and filter parameters to the API request
        const response = await axios.get("http://localhost:8080/api/users", {
          params: {
            page: currentPage,
            limit: usersPerPage,
            search: searchQuery || undefined,
            role: role !== "all" ? role : undefined,
          },
        });

        setUsers(response.data.users);
        setTotalUsers(response.data.total || response.data.users.length);
        setTotalPages(
          Math.ceil(
            (response.data.total || response.data.users.length) / usersPerPage
          )
        );
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersOverview();
    fetchUsers();
  }, [currentPage, searchQuery, role, status]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than max pages to show
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Add first page
      pageNumbers.push(1);

      // Add middle pages
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if current page is near the beginning or end
      if (currentPage <= 2) {
        endPage = 3;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 2;
      }

      // Add ellipsis if needed before middle pages
      if (startPage > 2) {
        pageNumbers.push("...");
      }

      // Add middle page numbers
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis if needed after middle pages
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }

      // Add last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    // Reset to first page when searching
    setCurrentPage(1);
    setSearchQuery(e.target.value);
  };

  // Handle role and status changes
  const handleRoleChange = (value) => {
    setRole(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Loading state
  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Calculate the range of users being displayed
  const startIndex = (currentPage - 1) * usersPerPage + 1;
  const endIndex = Math.min(startIndex + users.length - 1, totalUsers);

  return (
    <div className="ml-64 min-h-screen bg-gray-100 text-gray-800 flex flex-col gap-6 p-6">
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">
              Manage user accounts and permissions
            </p>
          </div>
          <Button
            className="w-full md:w-auto bg-my-primary text-white"
            onClick={() => {
              window.open(
                "http://localhost:5173/sign-up",
                "_blank",
                "noopener,noreferrer"
              );
            }}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-white text-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{userInfo.totalUsers}</div>
            </CardContent>
          </Card>

          <Card className="bg-white text-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Signups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{userInfo.newSignups}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1 space-y-1.5">
            <label htmlFor="search" className="text-sm font-medium">
              Search Users
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by name, email, or role..."
                className="pl-8 hover:border-my-primary focus:border-my-primary focus:ring-my-primary ring-my-primary ring-2 mt-2 focus:outline-none focus:ring-0"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:flex">
            <div className="space-y-1.5">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <Select value={role} onValueChange={handleRoleChange}>
                <SelectTrigger id="role" className="w-full md:w-[130px]">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger id="status" className="w-full md:w-[130px]">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="idle">Idle</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="icon" className="mt-auto">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
            <Button variant="outline" size="icon" className="mt-auto">
              <ArrowUpDown className="h-4 w-4" />
              <span className="sr-only">Sort</span>
            </Button>
          </div>
        </div>

        <Card className="bg-white text-gray-800 gap-1">
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <CardTitle>All Users</CardTitle>
              <CardDescription>
                {loading
                  ? "Loading..."
                  : `Showing ${users.length} of ${totalUsers} users`}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-my-primary">
                <TableRow className="hover:bg-muted/0">
                  <TableHead className="text-white">User</TableHead>
                  <TableHead className="hidden md:table-cell text-white">
                    Role
                  </TableHead>
                  <TableHead className="hidden md:table-cell text-white">
                    Join Date
                  </TableHead>
                  <TableHead className="text-right text-white">Posts</TableHead>
                  <TableHead className="text-right text-white">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-my-primary-100">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={user.imageUrl || "/placeholder.svg"}
                              alt={`${user.firstName} ${user.lastName}`}
                              className="object-cover"
                            />
                            <AvatarFallback>
                              {user.firstName?.charAt(0)}
                              {user.lastName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant={
                            user.role === "admin"
                              ? "default"
                              : user.role === "user"
                              ? "secondary"
                              : "outline"
                          }
                          className="capitalize bg-my-primary text-white"
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        {user._count?.posts || 0}
                      </TableCell>
                      <TableCell className="text-right ">
                        <DropdownMenu className="">
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="">
                              <MoreHorizontal className="h-4 w-4 " />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <UserCog className="mr-2 h-4 w-4" />
                              Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <ShieldAlert className="mr-2 h-4 w-4" />
                              Change Role
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      No users found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="mt-auto flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {totalUsers > 0 ? (
            <>
              Showing <strong>{startIndex}</strong> to{" "}
              <strong>{endIndex}</strong> of <strong>{totalUsers}</strong> users
            </>
          ) : (
            "No users found"
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>

          {getPageNumbers().map((pageNum, index) =>
            pageNum === "..." ? (
              <span key={`ellipsis-${index}`} className="mx-1">
                ...
              </span>
            ) : (
              <Button
                key={`page-${pageNum}`}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                className={`h-8 w-8 ${
                  currentPage === pageNum ? "bg-my-primary text-white" : ""
                }`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
