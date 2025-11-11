import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Calendar, User, Tag, ArrowLeft, Share2, Clock } from "lucide-react";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from "react-markdown";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  featured_image: string | null;
  author_name: string;
  category: string;
  tags: string[] | null;
  published_at: string;
  meta_title: string | null;
  meta_description: string | null;
  view_count: number;
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts" as any)
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

      if (error || !data) {
        toast.error("Blog post not found");
        navigate("/blog");
        return;
      }

      setPost(data as unknown as BlogPost);
      incrementViewCount((data as any).id);
      fetchRelatedPosts(((data as unknown as BlogPost)).category, (data as any).id);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching post:", error);
      navigate("/blog");
    }
  };

  const incrementViewCount = async (postId: string) => {
    try {
      await supabase.rpc("increment_blog_view_count" as any, { post_id: postId });
    } catch (error) {
      // Silently fail - view count is not critical
      console.error("Error incrementing view count:", error);
    }
  };

  const fetchRelatedPosts = async (category: string, currentPostId: string) => {
    try {
      const { data } = await supabase
        .from("blog_posts" as any)
        .select("id, title, slug, excerpt, featured_image, category")
        .eq("category", category)
        .eq("is_published", true)
        .neq("id", currentPostId)
        .limit(3);

      if (data) {
        setRelatedPosts(data as any[]);
      }
    } catch (error) {
      console.error("Error fetching related posts:", error);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const shareUrl = encodeURIComponent(window.location.href);
  const shareTitle = encodeURIComponent(post?.title || "");

  const socialShareButtons = [
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      url: `https://wa.me/?text=${shareTitle}%20${shareUrl}`,
      color: "hover:text-green-500",
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      color: "hover:text-blue-600",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      url: `https://www.instagram.com/`,
      color: "hover:text-pink-500",
      note: "Copy link to share on Instagram",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-8">
          <Skeleton className="h-96 w-full mb-8" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) return null;

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": post.featured_image || "",
    "datePublished": post.published_at,
    "author": {
      "@type": "Organization",
      "name": post.author_name
    },
    "publisher": {
      "@type": "Organization",
      "name": "Ebeth Boutique and Exquisite Store",
      "logo": {
        "@type": "ImageObject",
        "url": `${window.location.origin}/ebeth-logo.jpg`
      }
    },
    "description": post.meta_description || post.content.substring(0, 160)
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={post.meta_title || post.title}
        description={post.meta_description || post.content.substring(0, 160)}
        keywords={post.tags?.join(", ") || "fashion blog, style tips, boutique Abuja"}
        image={post.featured_image || undefined}
        type="article"
        schema={blogSchema}
      />
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        {post.featured_image && (
          <div className="relative h-64 md:h-96 lg:h-[500px] overflow-hidden bg-secondary">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
        )}

        <div className="container mx-auto px-4 py-6 md:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Button
              variant="ghost"
              className="mb-6 hover:text-gold"
              onClick={() => navigate("/blog")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>

            {/* Article Header */}
            <article>
              <Badge className="bg-gold/10 text-gold border-gold/20 mb-4">
                {post.category}
              </Badge>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">
                {post.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-muted-foreground mb-6 md:mb-8 pb-6 md:pb-8 border-b border-border">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.published_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{estimateReadingTime(post.content)} min read</span>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  {socialShareButtons.map((social) => (
                    <Button
                      key={social.name}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (social.note) {
                          navigator.clipboard.writeText(window.location.href);
                          toast.success(social.note);
                        } else {
                          window.open(social.url, '_blank', 'noopener,noreferrer');
                        }
                      }}
                      className={`${social.color} transition-colors`}
                      title={`Share on ${social.name}`}
                    >
                      <social.icon className="h-4 w-4" />
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="hover:text-gold"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none mb-8 md:mb-12">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <h1 className="text-3xl md:text-4xl font-bold mb-4 mt-8">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-2xl md:text-3xl font-bold mb-3 mt-6">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-xl md:text-2xl font-bold mb-2 mt-4">{children}</h3>,
                    p: ({ children }) => <p className="mb-4 text-base md:text-lg leading-relaxed text-foreground">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2 text-foreground">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2 text-foreground">{children}</ol>,
                    li: ({ children }) => <li className="text-base md:text-lg">{children}</li>,
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8 md:mb-12">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 text-sm bg-secondary px-3 py-1.5 rounded-full"
                    >
                      <Tag className="h-3.5 w-3.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-12 md:mt-16 pt-8 md:pt-12 border-t border-border">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.slug}`}
                      className="group"
                    >
                      <div className="bg-card rounded-lg shadow-card hover:shadow-luxury transition-all duration-300 overflow-hidden">
                        {relatedPost.featured_image && (
                          <div className="aspect-video overflow-hidden bg-secondary">
                            <img
                              src={relatedPost.featured_image}
                              alt={relatedPost.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <Badge className="bg-gold/10 text-gold border-gold/20 mb-2 text-xs">
                            {relatedPost.category}
                          </Badge>
                          <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-gold transition-colors text-sm md:text-base">
                            {relatedPost.title}
                          </h3>
                          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                            {relatedPost.excerpt}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-12 md:mt-16 bg-gradient-to-r from-gold/10 to-gold/5 rounded-lg p-6 md:p-8 border border-gold/20 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Shop the Looks
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto text-sm md:text-base">
                Find these styles and more at Ebeth Boutique Abuja
              </p>
              <Button
                variant="luxury"
                size="lg"
                onClick={() => navigate("/shop")}
              >
                Explore Collection
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
