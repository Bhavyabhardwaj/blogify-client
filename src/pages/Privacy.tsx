
import { Separator } from "@/components/ui/separator";

export default function Privacy() {
  return (
    <div className="container max-w-3xl py-12">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">Last updated: May 17, 2025</p>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
          <p className="text-muted-foreground">
            This Privacy Policy explains how we collect, use, process, and disclose your information when you use our blog platform.
            We are committed to protecting your personal information and your right to privacy.
          </p>
        </section>
        
        <Separator />
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Information We Collect</h2>
          <p className="text-muted-foreground mb-4">
            We collect information that you provide directly to us when you register for an account, create or edit your profile, 
            post content, or communicate with other users.
          </p>
          
          <div className="space-y-2">
            <p className="text-muted-foreground">This information may include:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Name, email address, and password</li>
              <li>Profile information such as a biography, avatar, and location</li>
              <li>Content you post, including blog posts, comments, and likes</li>
              <li>Communications you have with other users</li>
            </ul>
          </div>
        </section>
        
        <Separator />
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Information</h2>
          <p className="text-muted-foreground mb-4">
            We use the information we collect to provide, maintain, and improve our services, to develop new ones, 
            and to protect our platform and our users.
          </p>
          
          <div className="space-y-2">
            <p className="text-muted-foreground">Specifically, we use your information to:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Create and manage your account</li>
              <li>Enable you to communicate with other users</li>
              <li>Provide customer service</li>
              <li>Send you technical notices, updates, security alerts, and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Maintain the safety, security, and integrity of our platform</li>
            </ul>
          </div>
        </section>
        
        <Separator />
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Sharing Your Information</h2>
          <p className="text-muted-foreground mb-4">
            We do not share, sell, or otherwise disclose your personal information for purposes other than those outlined in this Privacy Policy.
          </p>
          
          <p className="text-muted-foreground">
            However, we may disclose your information in the following situations:
          </p>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
            <li>With your consent or at your direction</li>
            <li>To comply with laws or to respond to lawful requests and legal processes</li>
            <li>To protect the rights and property of our company, our agents, users, and others</li>
          </ul>
        </section>
        
        <Separator />
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Security</h2>
          <p className="text-muted-foreground">
            We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, 
            alteration, and destruction. However, no internet or email transmission is ever fully secure or error-free.
          </p>
        </section>
        
        <Separator />
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about this Privacy Policy, please contact us at privacy@example.com.
          </p>
        </section>
      </div>
    </div>
  );
}
