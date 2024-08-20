import { generateAccessToken, getProfileData } from "@/app/actions/linkedinActions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getUser } from "@/lib/getUser";
import { connectToDatabase } from "@/lib/mongodb";
import { ChevronLeft, Upload, User } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Profile({ searchParams }) {
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  if (!token) {
    redirect("/auth/login");
  }

  let profileData = null;
  let imageUrl = null;

  const user = await getUser(token.value);
  if (!user) {
    redirect("/auth/login");
  }
  if (searchParams) {
    let code = searchParams.code;
    if (code) {
      await generateAccessToken(code, user);
      redirect("/dashboard/profile");
    }
  }

  profileData = await getProfileData(user);
  if (profileData) {
    try {
      imageUrl = profileData.profilePicture["displayImage~"].elements[3].identifiers[0].identifier;
    } catch {}
  }

  return (
    <div>
      {profileData && profileData.vanityName ? (
        <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">Profile</h1>
            </div>
            <div className="grid gap-4 grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 col-span-3 lg:gap-8 ">
                <Card x-chunk="dashboard-07-chunk-0" className="flex items-center justify-start flex-col ">
                  {imageUrl ? (
                    <Image alt="Profile image" className="aspect-square m-5 object-cover rounded-full w-20" height="100" src={imageUrl} width="100" />
                  ) : (
                    <User className="aspect-square m-5 object-cover rounded-full w-24 h-full border-white border-4" />
                  )}
                  <CardHeader className="flex items-center gap-5">
                    <CardTitle className="flex items-center gap-3">
                      <Link href={`https://www.linkedin.com/in/${profileData.vanityName ? profileData.vanityName : ""}`} target="_blank">
                        {profileData.firstName.localized.en_US} {profileData.lastName.localized.en_US}
                      </Link>
                      <Badge variant="outline" className="ml-auto sm:ml-0 bg-green-400">
                        Connected
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-center">{profileData.localizedHeadline ? profileData.localizedHeadline : ""}</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
          <Card className="p-6">
            <CardTitle className="p-4">You have not connected your LinkedIn account.</CardTitle>
            <CardDescription className="p-4">Connect your LinkedIn account now.</CardDescription>
            <Link
              href={
                "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86zarhofajs6if&redirect_uri=http://localhost:3000/dashboard/profile&state=foobar123&scope=profile%20email%20w_member_social%20r_basicprofile"
              }
              className="p-4"
            >
              <Button>Connect Account</Button>
            </Link>
          </Card>
        </div>
      )}
    </div>
  );
}
