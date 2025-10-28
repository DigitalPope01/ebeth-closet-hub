import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import { productSchema } from "@/schemas/adminSchemas";

type Product = {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
  category_id: string;
  subcategory: string;
  description: string;
  product_images?: Array<{
    id: string;
    image_url: string;
    is_primary: boolean;
    sort_order: number;
  }>;
};

export default function AdminProducts() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock_quantity: "",
    category_id: "",
    subcategory: "",
    description: "",
    is_active: true,
  });
  const [productImages, setProductImages] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
      return;
    }

    const checkAdminStatus = async () => {
      if (!user) return;

      const { data } = await supabase.rpc("is_admin", { _user_id: user.id });

      if (!data) {
        navigate("/");
        return;
      }

      setIsAdmin(true);
      fetchProducts();
      fetchCategories();
    };

    if (user) {
      checkAdminStatus();
    }
  }, [user, loading, navigate]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select(`
        *,
        product_images(id, image_url, is_primary, sort_order)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to fetch products");
      return;
    }

    setProducts(data || []);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("id, name");
    setCategories(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    const validationResult = productSchema.safeParse({
      name: formData.name,
      price: parseFloat(formData.price),
      original_price: null,
      stock_quantity: parseInt(formData.stock_quantity),
      category_id: formData.category_id,
      subcategory: formData.subcategory || null,
      description: formData.description || null,
      is_active: formData.is_active,
    });

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => err.message).join(", ");
      toast.error(`Validation failed: ${errors}`);
      return;
    }

    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      stock_quantity: parseInt(formData.stock_quantity),
      category_id: formData.category_id,
      subcategory: formData.subcategory,
      description: formData.description,
      is_active: formData.is_active,
      slug: formData.name.toLowerCase().replace(/\s+/g, "-"),
    };

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);

        if (error) throw error;

        // Delete old images and insert new ones
        await supabase
          .from("product_images")
          .delete()
          .eq("product_id", editingProduct.id);

        if (productImages.length > 0) {
          const imageRecords = productImages.map((url, index) => ({
            product_id: editingProduct.id,
            image_url: url,
            is_primary: index === 0,
            sort_order: index,
          }));

          await supabase.from("product_images").insert(imageRecords);
        }

        toast.success("Product updated successfully");
      } else {
        const { data: newProduct, error } = await supabase
          .from("products")
          .insert(productData)
          .select()
          .single();

        if (error) throw error;

        // Insert product images
        if (productImages.length > 0) {
          const imageRecords = productImages.map((url, index) => ({
            product_id: newProduct.id,
            image_url: url,
            is_primary: index === 0,
            sort_order: index,
          }));

          await supabase.from("product_images").insert(imageRecords);
        }

        toast.success("Product created successfully");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to save product");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete product");
      return;
    }

    toast.success("Product deleted successfully");
    fetchProducts();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      stock_quantity: "",
      category_id: "",
      subcategory: "",
      description: "",
      is_active: true,
    });
    setProductImages([]);
    setEditingProduct(null);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock_quantity: product.stock_quantity.toString(),
      category_id: product.category_id,
      subcategory: product.subcategory || "",
      description: product.description || "",
      is_active: product.is_active,
    });
    
    // Load existing images
    const existingImages = product.product_images
      ?.sort((a, b) => a.sort_order - b.sort_order)
      .map(img => img.image_url) || [];
    setProductImages(existingImages);
    
    setIsDialogOpen(true);
  };

  if (loading || !isAdmin) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Product Management</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Stock Quantity</Label>
                  <Input
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Subcategory</Label>
                  <Input
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <ImageUpload
                  onImagesUploaded={setProductImages}
                  existingImages={productImages}
                  maxImages={5}
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <Button type="submit" className="w-full">
                  {editingProduct ? "Update Product" : "Create Product"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Subcategory</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>₦{product.price.toLocaleString()}</TableCell>
                <TableCell>{product.stock_quantity}</TableCell>
                <TableCell>{product.subcategory || "-"}</TableCell>
                <TableCell>{product.is_active ? "Active" : "Inactive"}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(product)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
