import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import BlogCard from "@/components/BlogCard";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, TrendingUp } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  author_name: string;
  category: string;
  tags: string[] | null;
  published_at: string;
}

export default function Blog() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [categoryFilter, sortBy]);

  const fetchCategories = async () => {
    try {
      const { data } = await supabase
        .from("blog_posts" as any)
        .select("category")
        .eq("is_published", true);
      
      if (data) {
        const uniqueCategories = [...new Set((data as any[]).map((post: any) => post.category as string))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    
    try {
      let query = supabase
        .from("blog_posts" as any)
        .select("id, title, slug, excerpt, featured_image, author_name, category, tags, published_at")
        .eq("is_published", true);

      if (categoryFilter) {
        query = query.eq("category", categoryFilter);
      }

      // Apply sorting
      switch (sortBy) {
        case "newest":
          query = query.order("published_at", { ascending: false });
          break;
        case "oldest":
          query = query.order("published_at", { ascending: true });
          break;
        case "popular":
          query = query.order("view_count", { ascending: false });
          break;
        default:
          query = query.order("published_at", { ascending: false });
      }

      const { data, error } = await query;
      
      if (!error && data) {
        setPosts(data as unknown as BlogPost[]);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Fashion Blog - Style Tips & Trends"
        description="Explore fashion tips, style guides, and the latest trends at Ebeth Boutique Abuja blog. Expert advice on designer fashion, accessories, and lifestyle."
        keywords="fashion blog, style tips, fashion trends Abuja, boutique blog, styling guide, fashion advice, designer tips, wardrobe essentials"
      />
      <Navbar />
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 mb-4">
            <div className="p-3 rounded-full bg-gold/10">
              <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-gold" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-2">
                Fashion <span className="text-gold">Blog</span>
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                Expert style tips, fashion trends, and wardrobe guides from Ebeth Boutique Abuja
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={() => window.location.href = "/blog"}
              className={`px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                !categoryFilter
                  ? "bg-gold text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              All Posts
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => (window.location.href = `/blog?category=${encodeURIComponent(category)}`)}
                className={`px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                  categoryFilter === category
                    ? "bg-gold text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-video" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 md:py-20">
            <BookOpen className="h-16 w-16 md:h-20 md:w-20 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl md:text-2xl font-bold mb-2">No Blog Posts Found</h3>
            <p className="text-muted-foreground">
              Check back soon for new fashion tips and style guides
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {posts.map((post) => (
              <BlogCard
                key={post.id}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                featuredImage={post.featured_image || undefined}
                authorName={post.author_name}
                category={post.category}
                publishedAt={post.published_at}
                tags={post.tags || undefined}
              />
            ))}
          </div>
        )}

        {/* CTA Section */}
        {!loading && posts.length > 0 && (
          <div className="mt-12 md:mt-16 bg-gradient-to-r from-gold/10 to-gold/5 rounded-lg p-6 md:p-8 border border-gold/20 text-center">
            <TrendingUp className="h-10 w-10 md:h-12 md:w-12 text-gold mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Ready to Shop These Trends?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto text-sm md:text-base">
              Discover our curated collection of premium fashion and accessories at Ebeth Boutique Abuja
            </p>
            <button
              onClick={() => window.location.href = "/shop"}
              className="bg-gold text-primary-foreground px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors"
            >
              Shop Collection
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
