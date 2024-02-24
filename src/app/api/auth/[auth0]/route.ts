import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

function getReturnTo(url: string | undefined | null) {
  if (!url) {
    return "/";
  }

  const searchParams = new URL(url as string).searchParams;
  return decodeURIComponent(searchParams.get("returnTo") as string) || "/";
}

export const GET = handleAuth({
  login: handleLogin((req) => {
    return { returnTo: getReturnTo(req.url) };
  }),
});
