// import { auth } from "@/auth";

// export default auth((req) => {
//   const { nextUrl } = req;

//   if (!req.auth && nextUrl.pathname !== "/signin") {
//     const newUrl = new URL("/signin", nextUrl.origin);
//     return Response.redirect(newUrl);
//   }
// });

// // Routes Middleware should not run on
// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

export {auth as middleware} from "@/auth";