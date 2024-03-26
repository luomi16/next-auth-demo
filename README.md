## 参考代码 link：[https://github.com/luomi16/next-auth-demo](https://github.com/luomi16/next-auth-demo)

<img src="https://img-blog.csdnimg.cn/direct/3b458cadf3b34ac78889636e59c8940f.png">

在 Next.js 中使用`next-auth`来实现登录和登出功能是一种流行且相对简单的方法。`next-auth`是一个专为 Next.js 开发的认证库，支持多种认证提供者，如 Google、Facebook、Twitter 以及基于邮箱的登录等。

以下是如何在 Next.js 项目中设置`next-auth`以实现登录和登出的基本步骤：

### 1. 安装`next-auth`

首先，你需要在你的 Next.js 项目中安装`next-auth`。打开你的终端，进入你的项目目录，然后运行：

```bash
npm install next-auth
```

或者，如果你使用`yarn`：

```bash
yarn add next-auth
```

### 2. 配置`next-auth`

接下来，你需要在你的项目中创建一个`next-auth`的配置文件。通常，这个文件位于`app/api/auth/[...nextauth].js`。在这个文件中，你可以配置你的认证提供者、数据库连接（如果需要）以及其他相关设置。

例如，使用 Google 和 Github 作为认证提供者，配置文件：

```javascript
// pages/api/auth/[...nextauth]/route.ts
import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
        clientId: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    }),
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],
  pages: {
    signIn: '/sign-in',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

### 3. `.env`文件配置

确保你在`.env`文件中添加了必要的环境变量，如`GOOGLE_CLIENT_ID`和`GOOGLE_CLIENT_SECRET`。

```javascript
GITHUB_CLIENT_ID=<你的GitHub客户端ID>
GITHUB_CLIENT_SECRET=<你的GitHub客户端密钥>
GOOGLE_CLIENT_ID=<你的Google客户端ID>
GOOGLE_CLIENT_SECRET=<你的Google客户端密钥>
NEXTAUTH_URL=http://localhost:3000/
NEXTAUTH_SECRET=<一个随机字符串作为你的NextAuth密钥>
```

### 4. 实现登录和登出

为了管理用户的登录状态，我们使用`next-auth`提供的`useSession`钩子。下面是一个在导航栏中实现登录状态检查和登出按钮的示例：

```javascript
//components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const { status } = useSession();
  return (
    <div className="flex justify-between pb-4 border-b mb-4">
      {status === 'authenticated' ? (
        <div>
          <button className="btn" onClick={() => signOut()}>
            Sign out
          </button>
        </div>
      ) : (
        <div className="flex items-center">
          <Link className="btn" href={'/sign-in'}>
            Sign in
          </Link>
        </div>
      )}
    </div>
  );
}
```

对于登录页面和按钮，我们可以创建一个简单的组件来处理登录逻辑：

```javascript
// components/SignInBtns.tsx
'use client';
import { signIn } from 'next-auth/react';

export default function SignInBtns() {
  return (
    <>
      <h1 className="text-center mt-8">Sign in</h1>
      <div className="mt-4 p-4 flex flex-col items-center justify-center gap-4">
        <button
          onClick={() => signIn('github')}
          className="flex items-center border p-4 rounded-full gap-4 hover:bg-slate-200/25 transition"
        >
          <span>
            <svg
              width="31"
              height="30"
              viewBox="0 0 104 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_88_9)">
                <path
                  d="M51.928 0.880554C23.6545 0.880554 0.727539 23.8032 0.727539 52.081C0.727539 74.7027 15.398 93.8948 35.7415 100.665C38.3003 101.139 39.2398 99.5542 39.2398 98.2019C39.2398 96.981 39.1923 92.9477 39.1702 88.6694C24.9262 91.7666 21.9206 82.6284 21.9206 82.6284C19.5915 76.7104 16.2357 75.1368 16.2357 75.1368C11.5903 71.959 16.5859 72.0243 16.5859 72.0243C21.7273 72.3855 24.4345 77.3005 24.4345 77.3005C29.001 85.1279 36.4122 82.865 39.3339 81.5567C39.7934 78.2476 41.1203 75.9889 42.5846 74.7103C31.2123 73.4156 19.2575 69.0254 19.2575 49.4068C19.2575 43.8169 21.2576 39.2495 24.5328 35.6639C24.0012 34.3743 22.2487 29.1668 25.0288 22.1143C25.0288 22.1143 29.3283 20.7382 39.1126 27.3625C43.1967 26.2281 47.5768 25.6592 51.928 25.6397C56.2792 25.6592 60.6626 26.2281 64.7544 27.3625C74.5268 20.7382 78.8203 22.1143 78.8203 22.1143C81.6072 29.1668 79.8538 34.3743 79.3222 35.6639C82.6051 39.2495 84.5917 43.8169 84.5917 49.4068C84.5917 69.072 72.614 73.402 61.2129 74.6696C63.0493 76.2585 64.6857 79.3744 64.6857 84.1512C64.6857 91.0019 64.6263 96.5155 64.6263 98.2019C64.6263 99.5644 65.5479 101.161 68.1432 100.658C88.4757 93.8804 103.128 74.695 103.128 52.081C103.128 23.8032 80.204 0.880554 51.928 0.880554ZM19.9038 73.8166C19.791 74.071 19.3908 74.1473 19.0262 73.9726C18.6549 73.8056 18.4463 73.4588 18.5667 73.2036C18.6769 72.9416 19.0779 72.8687 19.4485 73.0442C19.8207 73.2113 20.0326 73.5614 19.9038 73.8166ZM22.4223 76.0639C22.1781 76.2902 21.7007 76.1851 21.3768 75.8273C21.0419 75.4703 20.9792 74.993 21.2268 74.7632C21.4786 74.5369 21.9415 74.6428 22.2773 74.9998C22.6122 75.361 22.6775 75.8349 22.4223 76.0639ZM24.15 78.9391C23.8363 79.157 23.3234 78.9527 23.0063 78.4974C22.6926 78.0421 22.6926 77.496 23.0131 77.2773C23.331 77.0585 23.8363 77.2552 24.1577 77.7071C24.4705 78.1701 24.4705 78.7161 24.15 78.9391ZM27.0721 82.269C26.7914 82.5785 26.1937 82.4954 25.7562 82.0732C25.3085 81.6603 25.1839 81.0744 25.4654 80.7649C25.7494 80.4546 26.3506 80.5419 26.7914 80.9608C27.2357 81.3728 27.3714 81.9629 27.0721 82.269ZM30.8485 83.3932C30.7248 83.7942 30.1491 83.9765 29.5691 83.8061C28.99 83.6306 28.6111 83.1609 28.7281 82.7556C28.8485 82.352 29.4267 82.1621 30.0109 82.3444C30.5891 82.519 30.9689 82.9853 30.8485 83.3932ZM35.1463 83.87C35.1607 84.2922 34.669 84.6424 34.0602 84.65C33.4481 84.6636 32.9529 84.3219 32.9461 83.9065C32.9461 83.48 33.4269 83.1332 34.039 83.123C34.6478 83.1112 35.1463 83.4503 35.1463 83.87ZM39.3684 83.7082C39.4413 84.1202 39.0182 84.5433 38.4137 84.6561C37.8194 84.7646 37.2691 84.5102 37.1936 84.1016C37.1199 83.6793 37.5506 83.2562 38.1441 83.1469C38.7495 83.0417 39.2912 83.2893 39.3684 83.7082Z"
                  fill="#161614"
                />
              </g>
              <defs>
                <clipPath id="clip0_88_9">
                  <rect
                    width="102.4"
                    height="100"
                    fill="white"
                    transform="translate(0.727539 0.880554)"
                  />
                </clipPath>
              </defs>
            </svg>
          </span>
          Sign In With Github
        </button>
        <button
          onClick={() => signIn('google')}
          className="flex items-center border p-4 rounded-full gap-4 hover:bg-slate-200/25 transition"
        >
          <span>
            <svg
              width="30"
              height="30"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M94 51.0417C94 47.7917 93.7083 44.6667 93.1667 41.6667H50V59.3959H74.6667C73.6042 65.125 70.375 69.9792 65.5208 73.2292V84.7292H80.3333C89 76.75 94 65 94 51.0417Z"
                fill="#4285F4"
              />
              <path
                d="M50.0001 95.8333C62.3751 95.8333 72.7501 91.7291 80.3334 84.7291L65.5209 73.2291C61.4167 75.9791 56.1667 77.6041 50.0001 77.6041C38.0626 77.6041 27.9584 69.5416 24.3542 58.7083H9.04175V70.5833C16.5834 85.5625 32.0834 95.8333 50.0001 95.8333Z"
                fill="#34A853"
              />
              <path
                d="M24.3543 58.7084C23.4376 55.9584 22.9168 53.0209 22.9168 50C22.9168 46.9792 23.4376 44.0417 24.3543 41.2917V29.4167H9.04175C5.83341 35.8036 4.16392 42.8526 4.16675 50C4.16675 57.3959 5.93759 64.3959 9.04175 70.5834L24.3543 58.7084Z"
                fill="#FBBC05"
              />
              <path
                d="M50.0001 22.3959C56.7292 22.3959 62.7709 24.7084 67.5209 29.25L80.6668 16.1042C72.7292 8.70835 62.3542 4.16669 50.0001 4.16669C32.0834 4.16669 16.5834 14.4375 9.04175 29.4167L24.3542 41.2917C27.9584 30.4584 38.0626 22.3959 50.0001 22.3959Z"
                fill="#EA4335"
              />
            </svg>
          </span>
          Sign In With Google
        </button>
      </div>
    </>
  );
}
```

并且在登录页面 app/sign-in/page.tsx 中使用这个组件：

```javascript
// app/sign-in/page.tsx
import SignInBtns from '@/components/SignInBtns';

export default function Introduction() {
  return (
    <div>
      <SignInBtns />
    </div>
  );
}
```

### 5. 在`app/layout.tsx`中包裹你的组件以使用`SessionProvider`

为了让`next-auth`能在你的应用中正确管理会话，需要在应用的顶层添加`SessionProvider`。

```javascript
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { NextAuthProvider } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode,
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <div className="lg:max-w-[900px] lg:px-16 mx-auto py-8 shadow-xl min-h-screen flex flex-col px-8">
            <Navbar />
            <main className="flex-auto">{children}</main>
          </div>
        </NextAuthProvider>
      </body>
    </html>
  );
}
```

其中`NextAuthProvider`是我们自定义的组件，用于包裹`SessionProvider`。它的定义如下：

```javascript
// components/Providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';

export const NextAuthProvider = ({
  children,
}: {
  children: React.ReactNode,
}) => {
  return <SessionProvider>{children}</SessionProvider>;
};
```

### 完成

通过以上步骤，你已经在你的 Next.js 应用中集成了 next-auth，实现了基于 GitHub 和 Google 的登录。`next-auth`提供了许多高级功能和配置选项，你可以在其[官方文档](https://next-auth.js.org)中找到更多信息。
