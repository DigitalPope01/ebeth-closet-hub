import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
          About Ebeth Boutique
        </h1>
        <div className="max-w-3xl space-y-6 text-foreground/80">
          <p className="text-lg">
            Welcome to <span className="font-bold text-gold">Ebeth Boutique and Exquisite Store</span>, 
            your premier destination for premium fashion and lifestyle essentials in Nigeria.
          </p>
          <p>
            We curate a sophisticated collection of fashion, accessories, and household items that blend 
            boutique elegance with everyday convenience. Our mission is to bring you the finest selection 
            of products that enhance your lifestyle and express your unique style.
          </p>
          <div className="bg-card p-6 rounded-lg shadow-card">
            <h2 className="text-2xl font-bold mb-4 text-gold">Our Values</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-gold mr-2">✦</span>
                <span><strong>Quality:</strong> We source only the finest products for our customers</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold mr-2">✦</span>
                <span><strong>Style:</strong> Curated collections that reflect current trends and timeless elegance</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold mr-2">✦</span>
                <span><strong>Service:</strong> Exceptional customer experience from browsing to delivery</span>
              </li>
              <li className="flex items-start">
                <span className="text-gold mr-2">✦</span>
                <span><strong>Trust:</strong> Building lasting relationships through authenticity and reliability</span>
              </li>
            </ul>
          </div>
          <p>
            Visit us today and discover why Ebeth Boutique is the preferred choice for discerning 
            shoppers across Nigeria.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
