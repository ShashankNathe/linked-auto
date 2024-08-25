import Link from "next/link";
import React from "react";

const NotConnected = () => {
  return (
    <div className="flex items-center justify-center min-h-[80vh] flex-1">
      <div className="text-center">
        <Link
          href={
            "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86zarhofajs6if&redirect_uri=https://linked-auto.vercel.app/dashboard/profile&state=foobar123&scope=profile%20email%20w_member_social%20r_basicprofile%20r_organization_social"
          }
        >
          <h1 className="text-4xl font-bold text-primary">Linkedin Account Not Connected</h1>
          <p className="text-lg text-muted-foreground mt-2">Please connect your account to continue</p>
        </Link>
      </div>
    </div>
  );
};

export default NotConnected;
