import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carl Victoria — Portfolio",
  description: "Portfolio site for Carl Victoria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

{/* issue cleanup start */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `// Remove injected attributes that cause hydration mismatches
;(function(){
  try{
    var b = document && document.body;
    if(!b) return;
    var attrs = Array.prototype.slice.call(b.attributes || []);
    attrs.forEach(function(a){
      if(/^__processed_/.test(a.name) || a.name === 'bis_register'){
        b.removeAttribute(a.name);
      }
    });
  }catch(e){}
})();`,
          }}
        />
{/* issue cleanup end */}


        {children}
      </body>
    </html>
  );
}
