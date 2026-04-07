import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO, { buildFAQSchema } from "@/components/SEO";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Package, RefreshCw, Info, CreditCard, Truck, Phone } from "lucide-react";

export default function FAQ() {
  return (
    <>
      <SEO
        title="Frequently Asked Questions - Ebeth Boutique"
        description="Find answers to common questions about shipping, returns, payments, and products at Ebeth Boutique and Exquisite Store in Abuja, Nigeria."
        keywords="FAQ, help, shipping information, returns policy, payment methods, Ebeth Boutique Abuja"
        schema={buildFAQSchema([
          { question: "Do you offer delivery services in Abuja?", answer: "Yes, we offer delivery services within Abuja and surrounding areas. Delivery fees vary based on your location. You can also visit our physical store at Atlantic Mall, Utako for in-person shopping and pickup." },
          { question: "How long does delivery take?", answer: "Delivery within Abuja typically takes 1-3 business days. We offer same-day delivery for orders placed before 12 PM within certain areas." },
          { question: "What is your return policy?", answer: "We accept returns within 7 days of delivery for unworn, unwashed items with original tags attached. Contact us at ebethstores@gmail.com or call +234 909 203 4816 to initiate a return." },
          { question: "What payment methods do you accept?", answer: "We accept bank transfer, card payments, and cash on delivery for select areas. All online payments are processed securely." },
          { question: "Are your products authentic?", answer: "Yes, all products sold at Ebeth Boutique are 100% authentic. We source our items from authorized distributors and trusted suppliers." },
          { question: "Do you offer cash on delivery?", answer: "Yes, we offer cash on delivery for orders within select areas of Abuja. This option will be available at checkout if your delivery location qualifies." },
          { question: "What is the loyalty program?", answer: "Our loyalty program rewards you with points for every purchase. These points can be redeemed for discounts on future orders. Sign up for a free account to start earning points." },
          { question: "Can I see products in person before buying?", answer: "Yes! Visit our physical store at Atlantic Mall, 40 Ajose Adeogun St, Utako, Abuja. Open Monday to Sunday from 7:00 AM to 10:00 PM." },
        ])}
      />
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-center text-muted-foreground mb-12">
              Find answers to common questions about shopping at Ebeth Boutique
            </p>

            {/* Shipping Questions */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Truck className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Shipping & Delivery</h2>
              </div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="shipping-1">
                  <AccordionTrigger>Do you offer delivery services in Abuja?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we offer delivery services within Abuja and surrounding areas. Delivery fees vary based on your location. You can also visit our physical store at Atlantic Mall, Utako for in-person shopping and pickup.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping-2">
                  <AccordionTrigger>How long does delivery take?</AccordionTrigger>
                  <AccordionContent>
                    Delivery within Abuja typically takes 1-3 business days. We offer same-day delivery for orders placed before 12 PM within certain areas. You'll receive tracking information once your order is dispatched.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping-3">
                  <AccordionTrigger>What are the delivery charges?</AccordionTrigger>
                  <AccordionContent>
                    Delivery charges vary based on your location within Abuja. The delivery fee will be calculated and displayed at checkout before you complete your purchase. Orders above a certain amount may qualify for free delivery.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping-4">
                  <AccordionTrigger>Can I track my order?</AccordionTrigger>
                  <AccordionContent>
                    Yes! Once your order is dispatched, you'll receive a tracking number via SMS or email. You can also track your order status by logging into your account and viewing your order history.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Returns & Exchanges */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <RefreshCw className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Returns & Exchanges</h2>
              </div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="returns-1">
                  <AccordionTrigger>What is your return policy?</AccordionTrigger>
                  <AccordionContent>
                    We accept returns within 7 days of delivery for unworn, unwashed items with original tags attached. The item must be in its original condition and packaging. Please contact us at ebethstores@gmail.com or call +234 909 203 4816 to initiate a return.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="returns-2">
                  <AccordionTrigger>Can I exchange an item for a different size or color?</AccordionTrigger>
                  <AccordionContent>
                    Yes, exchanges are available for items in different sizes or colors, subject to availability. The item must meet our return conditions. Please contact us within 7 days of receiving your order to arrange an exchange.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="returns-3">
                  <AccordionTrigger>How do I return an item?</AccordionTrigger>
                  <AccordionContent>
                    To return an item, contact our customer service team at ebethstores@gmail.com or WhatsApp +234 909 203 4816. We'll provide you with return instructions. You can either drop off the item at our store or arrange for a pickup (pickup fees may apply).
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="returns-4">
                  <AccordionTrigger>When will I receive my refund?</AccordionTrigger>
                  <AccordionContent>
                    Once we receive and inspect your returned item, we'll process your refund within 5-7 business days. Refunds will be issued to your original payment method. Please note that it may take additional time for your bank to process the refund.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Payment Questions */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Payment & Pricing</h2>
              </div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="payment-1">
                  <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                  <AccordionContent>
                    We accept multiple payment methods including bank transfer, card payments, and cash on delivery (for select areas). All online payments are processed securely through trusted payment gateways.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="payment-2">
                  <AccordionTrigger>Is it safe to use my credit card on your website?</AccordionTrigger>
                  <AccordionContent>
                    Yes, absolutely. We use industry-standard SSL encryption to protect your payment information. We partner with trusted payment processors that comply with international security standards to ensure your transactions are safe and secure.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="payment-3">
                  <AccordionTrigger>Do you offer cash on delivery?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we offer cash on delivery for orders within select areas of Abuja. This option will be available at checkout if your delivery location qualifies. Please have the exact amount ready when our delivery agent arrives.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="payment-4">
                  <AccordionTrigger>Do you have sales or discount codes?</AccordionTrigger>
                  <AccordionContent>
                    Yes! We regularly offer promotions, discount codes, and special deals. Subscribe to our newsletter to receive exclusive offers and be the first to know about our sales. You can also check our Weekly Deals section for current promotions.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Product Information */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Info className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Product Information</h2>
              </div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="product-1">
                  <AccordionTrigger>Are your products authentic?</AccordionTrigger>
                  <AccordionContent>
                    Yes, all products sold at Ebeth Boutique are 100% authentic. We source our items from authorized distributors and trusted suppliers. We stand behind the quality and authenticity of every item we sell.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="product-2">
                  <AccordionTrigger>How do I know what size to order?</AccordionTrigger>
                  <AccordionContent>
                    Each product page includes detailed size information and measurements. We recommend checking the size guide before placing your order. If you're unsure about sizing, feel free to contact our customer service team for personalized assistance.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="product-3">
                  <AccordionTrigger>Do you restock sold-out items?</AccordionTrigger>
                  <AccordionContent>
                    We regularly restock popular items, but availability depends on our suppliers. If an item you want is out of stock, you can add it to your wishlist or contact us at ebethstores@gmail.com to inquire about restocking dates.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="product-4">
                  <AccordionTrigger>Can I see products in person before buying?</AccordionTrigger>
                  <AccordionContent>
                    Yes! You're welcome to visit our physical store at Atlantic Mall, 40 Ajose Adeogun St, Utako, Abuja. Our store is open Monday to Sunday from 7:00 AM to 10:00 PM. Our staff will be happy to show you products and answer any questions.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Orders & Account */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Package className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Orders & Account</h2>
              </div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="order-1">
                  <AccordionTrigger>Can I modify or cancel my order?</AccordionTrigger>
                  <AccordionContent>
                    You can modify or cancel your order within 2 hours of placement. After this time, orders are processed for dispatch and cannot be modified. Please contact us immediately at ebethstores@gmail.com or +234 909 203 4816 if you need to make changes.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="order-2">
                  <AccordionTrigger>Do I need an account to place an order?</AccordionTrigger>
                  <AccordionContent>
                    While you can browse products without an account, creating an account makes checkout faster and allows you to track orders, save items to your wishlist, and receive loyalty rewards. It only takes a minute to sign up!
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="order-3">
                  <AccordionTrigger>What is the loyalty program?</AccordionTrigger>
                  <AccordionContent>
                    Our loyalty program rewards you with points for every purchase. These points can be redeemed for discounts on future orders. Sign up for a free account to start earning points automatically with every purchase.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="order-4">
                  <AccordionTrigger>I forgot my password. What should I do?</AccordionTrigger>
                  <AccordionContent>
                    Click on the "Sign In" button and select "Forgot Password." Enter your email address, and we'll send you instructions to reset your password. If you continue to have issues, contact us at ebethstores@gmail.com.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            {/* Contact Section */}
            <div className="mt-16 bg-muted/50 rounded-lg p-8 text-center">
              <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Still Have Questions?</h3>
              <p className="text-muted-foreground mb-6">
                Our customer service team is here to help
              </p>
              <div className="space-y-2">
                <p className="font-medium">Email: ebethstores@gmail.com</p>
                <p className="font-medium">Phone/WhatsApp: +234 909 203 4816</p>
                <p className="text-sm text-muted-foreground">Available Monday - Sunday, 7:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
