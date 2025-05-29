import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Save, ArrowLeft, Eye, Trash2, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    content: "",
    categoryId: "",
    imageUrl: "",
    published: false,
    slug: "",
  });

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImage] = useState(null);

  // Load post data and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch post data
        const postResponse = await axios.get(
          `http://localhost:8080/api/posts/${id}`
        );
        const post = postResponse.data.post;

        // Fetch categories
        const categoriesResponse = await axios.get(
          "http://localhost:8080/api/categories"
        );

        setFormData({
          title: post.title || "",
          subtitle: post.subtitle || "",
          content: post.content || "",
          categoryId: post.categoryId || "",
          imageUrl: post.imageUrl || "",
          published: post.published || false,
          slug: post.slug || "",
        });

        if (post.imageUrl) {
          setImagePreview(post.imageUrl);
        }

        setCategories(categoriesResponse.data.categories || []);
      } catch (error) {
        console.error("Error fetching post data:", error);
        setError("Failed to load post data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle content change from ReactQuill
  const handleContentChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      content: content,
    }));
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      // Clear the existing imageUrl as we'll be uploading a new one
      setFormData((prev) => ({
        ...prev,
        imageUrl: "",
      }));
    }
  };

  // Convert image to base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  // Clear image preview
  const clearImage = () => {
    setImagePreview(null);
    setImage(null);
    setFormData((prev) => ({
      ...prev,
      imageUrl: "",
    }));
  };

  // Handle toggle switch for published status
  const handlePublishedChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      published: checked,
    }));
  };

  // Handle category selection
  const handleCategoryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: value,
    }));
  };

  // Save post changes
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      // Prepare data for submission
      const postData = { ...formData };

      // Handle image upload if a new image is selected
      if (image) {
        try {
          const imageData = await toBase64(image);
          postData.imageUrl = imageData;
        } catch (imgError) {
          console.error("Error converting image:", imgError);
          setError(
            "Failed to process the image. Please try a different image."
          );
          setSaving(false);
          return;
        }
      }

      const response = await axios.put(
        `http://localhost:8080/api/posts/${id}`,
        postData
      );

      setSaveMessage("Post updated successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Error updating post:", error);
      setError(
        error.response?.data?.message ||
          "Failed to update post. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // Preview post
  const handlePreview = () => {
    // Open the post preview in a new tab
    window.open(`http://localhost:5173/blog/${formData.slug}`, "_blank");
  };

  // Delete post
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/posts/${id}`);
      navigate("/posts");
    } catch (error) {
      console.error("Error deleting post:", error);
      setError("Failed to delete post. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading post data...</p>
      </div>
    );
  }

  return (
    <div className="ml-64 bg-gray-100 min-h-screen text-gray-800 flex flex-col">
      <div className="flex-1 flex flex-col gap-6 p-6 overflow-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/posts")}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Edit Post</h1>
              <p className="text-muted-foreground">Make changes to your post</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveMessage && (
              <Badge className="bg-green-500 text-white">{saveMessage}</Badge>
            )}

            <Button
              variant="outline"
              onClick={handlePreview}
              disabled={!formData.slug}
            >
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the post and remove it from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              className="bg-my-primary text-white"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Post Content</CardTitle>
                  <CardDescription>
                    Edit the main content of your post
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Enter post title"
                      value={formData.title}
                      onChange={handleChange}
                      className="hover:border-my-primary focus:border-my-primary"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subtitle">Subtitle</Label>
                    <Input
                      id="subtitle"
                      name="subtitle"
                      placeholder="Enter post subtitle (optional)"
                      value={formData.subtitle}
                      onChange={handleChange}
                      className="hover:border-my-primary focus:border-my-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <div className="min-h-[300px]">
                      <ReactQuill
                        id="content"
                        theme="snow"
                        value={formData.content}
                        onChange={handleContentChange}
                        className="h-64"
                        modules={{
                          toolbar: [
                            [{ header: [1, 2, 3, 4, 5, 6, false] }],
                            [
                              "bold",
                              "italic",
                              "underline",
                              "strike",
                              "blockquote",
                            ],
                            [
                              { list: "ordered" },
                              { list: "bullet" },
                              { indent: "-1" },
                              { indent: "+1" },
                            ],
                            ["link", "image"],
                            ["clean"],
                          ],
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Post Settings</CardTitle>
                  <CardDescription>
                    Configure post metadata and settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      name="slug"
                      placeholder="post-url-slug"
                      value={formData.slug}
                      onChange={handleChange}
                      className="hover:border-my-primary focus:border-my-primary"
                    />
                    <p className="text-xs text-muted-foreground">
                      The URL-friendly version of the title
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Featured Image</Label>
                    <div className="flex flex-col space-y-3">
                      <div className="flex flex-col md:flex-row md:items-center gap-6 relative">
                        {!imagePreview && (
                          <label
                            htmlFor="file"
                            className="cursor-pointer w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-500 hover:border-my-primary hover:text-my-primary transition"
                          >
                            <span className="text-sm">Choose Image File</span>
                            <input
                              id="file"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                        )}

                        {imagePreview && (
                          <div className="relative w-full h-32">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-xl border shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={clearImage}
                              className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1 shadow"
                            >
                              <X className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        )}
                      </div>

                      {imagePreview && !image && formData.imageUrl && (
                        <p className="text-xs text-muted-foreground">
                          Using existing image. Upload a new one to replace it.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-4">
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={handlePublishedChange}
                    />
                    <Label htmlFor="published">Published</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  {formData.imageUrl ? (
                    <div className="aspect-video w-full overflow-hidden rounded-md">
                      <img
                        src={formData.imageUrl}
                        alt="Post preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg";
                          e.target.alt = "Image not available";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full overflow-hidden rounded-md bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">No image</p>
                    </div>
                  )}

                  <div className="mt-2">
                    <h3 className="font-medium">
                      {formData.title || "Post Title"}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {formData.subtitle || "Post subtitle will appear here"}
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={handlePreview}
                    disabled={!formData.slug}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview Full Post
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
