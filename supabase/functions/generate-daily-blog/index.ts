import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fashion blog topics for variety
    const topics = [
      "seasonal fashion trends and styling tips",
      "accessory pairing guide for different occasions",
      "wardrobe essentials every fashionista needs",
      "color coordination and pattern mixing in fashion",
      "sustainable fashion and ethical shopping",
      "fashion trends from Abuja to global runways",
      "styling tips for different body types",
      "building a capsule wardrobe",
      "fashion care and maintenance tips",
      "transitional pieces for changing seasons"
    ];

    const categories = ["Style Guide", "Fashion Tips", "Trends", "How To", "Seasonal"];
    
    // Select random topic and category
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];

    console.log(`Generating blog post about: ${topic}`);

    // Generate blog content using Lovable AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are a fashion expert writing for Ebeth Boutique and Exquisite Store in Abuja, Nigeria. Write engaging, SEO-optimized blog posts about fashion, style tips, and trends. Use a friendly, professional tone. Include practical advice and styling suggestions."
          },
          {
            role: "user",
            content: `Write a comprehensive blog post about ${topic}. Include:
            1. An engaging title (50-60 characters)
            2. A brief excerpt (150-160 characters)
            3. Full article content in markdown format (800-1200 words)
            4. 3-5 relevant tags
            5. SEO meta title (50-60 characters)
            6. SEO meta description (150-160 characters)
            
            Format your response as JSON:
            {
              "title": "...",
              "excerpt": "...",
              "content": "...",
              "tags": ["tag1", "tag2", "tag3"],
              "meta_title": "...",
              "meta_description": "..."
            }`
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errorText);
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices[0].message.content;
    
    // Parse the JSON response
    const blogData = JSON.parse(content);

    // Generate slug from title
    const slug = blogData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingPost) {
      console.log("Blog post with this slug already exists, skipping...");
      return new Response(
        JSON.stringify({ message: "Post already exists" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert blog post into database
    const { data: newPost, error: insertError } = await supabase
      .from('blog_posts')
      .insert({
        title: blogData.title,
        slug: slug,
        excerpt: blogData.excerpt,
        content: blogData.content,
        author_name: "Ebeth Boutique Team",
        category: category,
        tags: blogData.tags,
        meta_title: blogData.meta_title,
        meta_description: blogData.meta_description,
        is_published: true,
        published_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Database insert error:", insertError);
      throw insertError;
    }

    console.log("Successfully created blog post:", newPost.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        post: newPost,
        message: "Daily blog post generated successfully"
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Error in generate-daily-blog function:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
