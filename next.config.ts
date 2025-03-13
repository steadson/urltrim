import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

   // Environment variables
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    IPINFO_TOKEN: process.env.IPINFO_TOKEN,
  },

};
 


export default nextConfig;


