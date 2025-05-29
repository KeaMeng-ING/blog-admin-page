import {
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
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
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CommentsPage() {
  // Sample comment data
  const comments = [
    {
      id: "1",
      content:
        "Great article! The section on async/await was particularly helpful.",
      status: "active",
      author: {
        name: "Alex Johnson",
        email: "alex@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      post: {
        id: "1",
        title: "Mastering JavaScript: A Comprehensive Guide",
      },
      date: "26 April, 2025",
      likes: 5,
      replies: 2,
    },
    {
      id: "2",
      content:
        "I've been struggling with Promises for a while, but your explanation made it click for me. Thanks!",
      status: "active",
      author: {
        name: "Emma Wilson",
        email: "emma@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      post: {
        id: "1",
        title: "Mastering JavaScript: A Comprehensive Guide",
      },
      date: "26 April, 2025",
      likes: 3,
      replies: 1,
    },
    {
      id: "3",
      content:
        "This is exactly what I needed to understand the concept. Would love to see more content like this!",
      status: "active",
      author: {
        name: "Miguel Rodriguez",
        email: "miguel@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      post: {
        id: "2",
        title: "CSS Grid vs Flexbox: When to Use Each",
      },
      date: "25 April, 2025",
      likes: 0,
      replies: 0,
    },
    {
      id: "4",
      content:
        "Check out my website at spamlink.com for more information on this topic!",
      status: "reported",
      author: {
        name: "Spam Bot",
        email: "spam@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      post: {
        id: "3",
        title: "The Journey of a Creative Coder: From Classrooms to Industry",
      },
      date: "24 April, 2025",
      likes: 0,
      replies: 0,
    },
    {
      id: "5",
      content:
        "I disagree with your point about React hooks. They're actually much more powerful than you suggest.",
      status: "reported",
      author: {
        name: "Jamal Ahmed",
        email: "jamal@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      post: {
        id: "4",
        title: "Understanding React Hooks",
      },
      date: "23 April, 2025",
      likes: 1,
      replies: 0,
    },
  ];

  return (
    <div className="ml-64 min-h-screen bg-gray-100 text-gray-800 flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Comments</h1>
          <p className="text-muted-foreground">
            Manage and moderate comments across all blog posts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="ml-auto bg-my-primary text-white">
            {comments.length} Total
          </Badge>
          <Badge variant="outline" className="bg-my-primary-100 text-black">
            {comments.filter((c) => c.status === "active").length} Active
          </Badge>
          <Badge variant="outline" className="bg-my-primary-100 text-black">
            {comments.filter((c) => c.status === "reported").length} Reported
          </Badge>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1 space-y-1.5">
          <label htmlFor="search" className="text-sm font-medium">
            Search Comments
          </label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by content, author, or post..."
              className="pl-8"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="status-filter" className="text-sm font-medium">
            Status
          </label>
          <Select defaultValue="all">
            <SelectTrigger id="status-filter" className="w-[130px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="reported">Reported</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
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

      <Card className="bg-gray-100 text-gray-800 ">
        <CardHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <CardTitle>All Comments</CardTitle>
            <CardDescription>
              Showing {comments.length} comments
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-my-primary">
              <TableRow className="hover:bg-muted/0">
                <TableHead>Comment</TableHead>
                <TableHead className="hidden md:table-cell">Post</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((comment) => (
                <TableRow key={comment.id}>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <Avatar className="mt-1">
                        <AvatarImage
                          src={comment.author.avatar || "/placeholder.svg"}
                          alt={comment.author.name}
                        />
                        <AvatarFallback>
                          {comment.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{comment.author.name}</div>
                        <div className="text-sm text-muted-foreground md:hidden">
                          {comment.post.title}
                        </div>
                        <p className="mt-1 line-clamp-2 text-sm">
                          {comment.content}
                        </p>
                        <div className="mt-1 text-xs text-muted-foreground md:hidden">
                          {comment.date}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="font-medium">{comment.post.title}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {comment.date}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant={
                        comment.status === "active" ? "default" : "destructive"
                      }
                    >
                      {comment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        {comment.status === "reported" ? (
                          <DropdownMenuItem>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Active
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem>
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Report
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing <strong>1</strong> to <strong>{comments.length}</strong> of{" "}
          <strong>{comments.length}</strong> comments
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" disabled>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8">
            1
          </Button>
          <Button variant="outline" size="icon" disabled>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
