import Logo from "./components/Logo";
import Title from "./components/Title";
import ApplyForm from "./components/ApplyForm";
import Container from "./components/Container";
import HeaderComponent from "./components/Header";
import { GoLinkExternal } from "react-icons/go";

export default function Home() {
  return (
    <>
      <HeaderComponent />
      <Container>
        <div className="border py-8 px-5 md:px-8 my-4 bg-[#FFFFFF] rounded-[16px]">
          <div className="mb-4">
            <Title title="申し込みフォーム" />
          </div>
          <p className="text-[12px] font-light mb-4">
            下記のフォームをご入力ください。ご入金時のBTC数量は、以
            下に表示される数量となります
          </p>
          <ApplyForm />
          <a href="#" className="mt-14 block underline">
            こちらも併せてご確認ください
          </a>
          <div className="flex flex-row gap-1 items-center">
            <p className="text-[12px] font-light">
              <a
                href="https://bitflyer.com/en-jp/s/how-to-start"
                target="_blank"
              >
                bitFlyer口座開設方法
              </a>
              ・
              <a
                href="https://trustwallet.com/blog/the-official-beginners-guide-to-trust-wallet"
                target="_blank"
              >
                Trust Walletアカウント設定方法
              </a>
            </p>
            <a href="">
              <GoLinkExternal />
            </a>
          </div>
          <div className="flex flex-row gap-1 items-center">
            <p className="text-[12px] font-light">
              <a
                href="https://www.japan-guide.com/e/e2226.html"
                target="_blank"
              >
                日本在住者向け・入出金ガイド
              </a>
            </p>
            <a href="">
              <GoLinkExternal />
            </a>
          </div>
        </div>
      </Container>
    </>
  );
}
