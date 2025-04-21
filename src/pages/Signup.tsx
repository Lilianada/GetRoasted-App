import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

import { useForm } from "react-hook-form";

const Signup = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const handleSignup = async (data: any) => {
    // handle signup logic here
  }

  return (

    <div className="flex flex-col items-center justify-center bg-night p-4">
      <div className="w-full max-w-md">
        
        <Tabs defaultValue="signup" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-night-800 border border-night-700">
            <TabsTrigger value="login" className="data-[state=active]:bg-yellow">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-yellow">
              Sign Up
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card className="bg-secondary border-2 border-black border-night-700">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Welcome back</CardTitle>
                <CardDescription>
                  Sign in to your account to continue
                </CardDescription>
              </CardHeader>
              <LoginForm />
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card className="bg-secondary border-2 border-black border-night-700">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Create an account</CardTitle>
                <CardDescription>
                  Enter your info to get started
                </CardDescription>
              </CardHeader>
              <SignupForm />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Signup;
