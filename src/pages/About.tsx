<<<<<<< HEAD
=======

>>>>>>> 4dca2e8011f1cae31420e26f74385e97d94f5d9e
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function About() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">About Us</h1>
      
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Our Story</CardTitle>
            <CardDescription>How we started our journey</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm">
            <p>
              Welcome to our blog platform! This is a place where people can share their thoughts,
              ideas, and stories with the world. We believe in the power of words and the importance
              of giving everyone a voice.
            </p>
            <p>
              Our mission is to create a space where creativity flourishes and meaningful connections
              are made. Whether you're here to read interesting content or share your own perspective,
              we're glad to have you as part of our community.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Meet the Founder</CardTitle>
            <CardDescription>The person behind this project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback>BB</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Bhavya Bhardwaj</h3>
                <div className="prose prose-sm">
                  <p>
                    Hi! I'm Bhavya Bhardwaj, the founder of this blogging platform. 
                    I created this site because I'm passionate about building communities 
                    and providing people with a platform to express themselves.
                  </p>
                  <p>
                    With a background in web development and a love for writing, 
                    I wanted to create something that combines both of these interests
                    while creating value for others. I hope you enjoy using this platform
                    as much as I enjoyed building it!
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Our Values</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Authenticity</h3>
                <p className="text-muted-foreground">
                  We value genuine expression and honest communication. 
                  Being true to yourself and your voice matters here.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Community</h3>
                <p className="text-muted-foreground">
                  We believe in the power of connection and building relationships
                  through shared stories and experiences.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-lg">Creativity</h3>
                <p className="text-muted-foreground">
                  We encourage innovative thinking and creative expression
                  in all forms of content shared on our platform.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
