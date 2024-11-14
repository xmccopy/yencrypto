import localFont from "next/font/local";
import Logo from "./components/Logo";
import Title from "./components/Title";
import ApplyForm from "./components/ApplyForm";
import Container from "./components/Container";
import { GoLinkExternal } from "react-icons/go";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  return (
    <>
      <Container>
        <div className="border py-4 px-8 my-4">
          <Logo />
          <div className="my-4">
            <Title title="申し込みフォーム" />
          </div>
          <p className="text-[12px] font-light mb-4">
            下記のフォームをご入力いただき、ご入金時の仮想通貨をご選択
            ください。ご入金時の仮想通貨送金数量は、以下の表示数量とな
            ります。
          </p>
          <ApplyForm />
          <a href="#" className="mt-14 block underline">こちらも併せてご確認ください</a>
          <div className="flex flex-row gap-1 items-center">
            <p className="text-[12px] font-light">
              bitFlyer口座開設方法・Trust Walletアカウント設定方法
            </p>
            <a href=""><GoLinkExternal /></a>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <p className="text-[12px] font-light">
              日本在住者向け・入出金ガイド
            </p>
            <a href=""><GoLinkExternal /></a>
          </div>
        </div>
      </Container>
    </>
  );
}


