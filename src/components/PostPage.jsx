import {
  PlusCircle,
  Search,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";
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
import { useEffect, useState } from "react";
import axios from "axios";

export default function PostPage() {
  // State variables
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const postsPerPage = 10;

  // Fetch posts with pagination and filters
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // Add pagination and filter parameters to the API request
        const response = await axios.get(
          "https://blog-backend-a3p6.onrender.com/api/posts",
          {
            params: {
              page: currentPage,
              limit: postsPerPage,
              search: searchQuery || undefined,
              status: status !== "all" ? status : undefined,
              category: category !== "all" ? category : undefined,
            },
          }
        );

        setPosts(response.data.posts);
        setTotalPosts(response.data.total || response.data.posts.length);
        setTotalPages(
          Math.ceil(
            (response.data.total || response.data.posts.length) / postsPerPage
          )
        );
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, searchQuery, status, category]);

  // Fetch categories for the filter dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "https://blog-backend-a3p6.onrender.com/api/categories"
        );
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

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

  // Handle search input change with debounce
  const handleSearchChange = (e) => {
    // Reset to first page when searching
    setCurrentPage(1);
    setSearchQuery(e.target.value);
  };

  // Handle status and category changes
  const handleStatusChange = (value) => {
    setStatus(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleCategoryChange = (value) => {
    setCategory(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Calculate the range of posts being displayed
  const startIndex = (currentPage - 1) * postsPerPage + 1;
  const endIndex = Math.min(startIndex + posts.length - 1, totalPosts);

  return (
    <div className="ml-64 bg-gray-100 h-screen text-gray-800 flex flex-col">
      <div className="flex-1 flex flex-col gap-6 p-6 overflow-auto">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Posts</h1>
            <p className="text-muted-foreground">
              Manage your blog posts and content
            </p>
          </div>
          <Button className="w-full md:w-auto bg-my-primary text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="flex-1 space-y-1.5">
            <label htmlFor="search" className="text-sm font-medium">
              Search Posts
            </label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by title, author, or content..."
                className="pl-8 hover:border-my-primary focus:border-my-primary focus:ring-my-primary ring-my-primary ring-2 mt-2 focus:outline-none focus:ring-0"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 md:flex">
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
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger id="category" className="w-full md:w-[130px]">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name.toLowerCase()}>
                      {cat.name}
                    </SelectItem>
                  ))}
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
              <CardTitle>All Posts</CardTitle>
              <CardDescription>
                {loading
                  ? "Loading..."
                  : `Showing ${posts.length} of ${totalPosts} posts`}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-my-primary">
                <TableRow className="hover:bg-muted/0">
                  <TableHead className="text-white">Post</TableHead>
                  <TableHead className="hidden md:table-cell text-white">
                    Category
                  </TableHead>
                  <TableHead className="hidden md:table-cell text-white">
                    Status
                  </TableHead>
                  <TableHead className="hidden md:table-cell text-white">
                    Date
                  </TableHead>
                  <TableHead className="text-right text-white">Views</TableHead>
                  <TableHead className="text-right text-white">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <TableRow key={post.id} className="hover:bg-my-primary-100">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 overflow-hidden rounded">
                            <img
                              src={post.imageUrl || "/placeholder.svg"}
                              alt={post.title}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium">{post.title}</div>
                            <div className="hidden text-sm text-muted-foreground md:block">
                              by {post.authorName}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {post.categoryName}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge
                          variant={
                            post.published === true
                              ? "default"
                              : post.published === false
                              ? "outline"
                              : "secondary"
                          }
                        >
                          {post.published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {post.createdAt.split(" - ")[0]}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {post.views >= 1000
                              ? `${(post.views / 1000).toFixed(1)}k`
                              : post.views}
                          </span>
                        </div>
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
                            <NavLink
                              to={`https://blog-frontend-react-one.vercel.app//blog/${post.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                            </NavLink>
                            <NavLink>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            </NavLink>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No posts found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="mt-auto p-6 bg-gray-100 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {totalPosts > 0 ? (
              <>
                Showing <strong>{startIndex}</strong> to{" "}
                <strong>{endIndex}</strong> of <strong>{totalPosts}</strong>{" "}
                posts
              </>
            ) : (
              "No posts found"
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
    </div>
  );
}
