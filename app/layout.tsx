// app/layout.tsx

import ReduxProvider from "./ReduxProvider";

export const metadata = {
  title: "My App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
