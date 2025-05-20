
import { Separator } from "@/components/ui/separator";

export default function Terms() {
  return (
    <div className="container max-w-3xl py-12">
      <h1 className="text-4xl font-bold mb-6">Terms and Conditions</h1>
      <p className="text-muted-foreground mb-8">Last updated: May 17, 2025</p>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
          <p className="text-muted-foreground">
            Welcome to our blog platform. By using our service, you agree to these terms and conditions in full. 
            If you disagree with these terms and conditions or any part of them, you must not use our service.
          </p>
        </section>
        
        <Separator />
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">2. User Accounts</h2>
          <p className="text-muted-foreground mb-4">
            When you create an account with us, you must provide information that is accurate, complete, and current at all times.
            Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.
          </p>
          
          <p className="text-muted-foreground">
            You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
            You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or 
            unauthorized use of your account.
          </p>
        </section>
        
        <Separator />
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">3. Content</h2>
          <p className="text-muted-foreground mb-4">
            Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material.
            You are responsible for the content that you post on or through the service, including its legality, reliability, and appropriateness.
          </p>
          
          <p className="text-muted-foreground">
            By posting content on or through our service, you represent and warrant that: (i) the content is yours or you have the right to use it and grant us
            the rights and license as provided in these Terms, and (ii) that the posting of your content on or through our service does not violate the privacy rights, 
            publicity rights, copyrights, contract rights or any other rights of any person or entity.
          </p>
        </section>
        
        <Separator />
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Prohibited Uses</h2>
          <p className="text-muted-foreground mb-4">
            You may use our service only for lawful purposes and in accordance with these Terms.
          </p>
          
          <div className="space-y-2">
            <p className="text-muted-foreground">You agree not to use our service:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>In any way that violates any applicable national or international law or regulation.</li>
              <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail", "chain letter", "spam", or any other similar solicitation.</li>
              <li>To impersonate or attempt to impersonate another user or any other person or entity.</li>
              <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful.</li>
            </ul>
          </div>
        </section>
        
        <Separator />
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Changes to Terms</h2>
          <p className="text-muted-foreground">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 15 days' notice 
            prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
        </section>
        
        <Separator />
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Contact Us</h2>
          <p className="text-muted-foreground">
            If you have any questions about these Terms, please contact us at support@example.com.
          </p>
        </section>
      </div>
    </div>
  );
}
