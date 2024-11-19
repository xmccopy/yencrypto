"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import TextInput from "./TextInput";
import { useEffect, useMemo, useState } from "react";
import { NumericFormat } from "react-number-format";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface TrackingTokenPriceProps {
  currency: string;
  usdPrice: number;
  jpyPrice: number;
  currentTime: string;
}

const cryptoLabel: Record<string, string> = {
  BTC: "必要なビットコイン数:",
  ETH: "必要なイーサリアム:",
  LTC: "必要なUSDT:",
};

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  applicationType: string;
  csid: string;
  participantCount: number;
  cryptoType: string;
}

const CombinedForm = () => {
  const [tokenType, setTokenType] = useState<string>("BTC");
  const [usdPrice, setUsdPrice] = useState<number>(1);
  const [jpyPrice, setJPYPrice] = useState<number>(0);
  const [jpyValue, setJpyValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [calcPrice2, setCalcPrice2] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>("");

  const updateTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    setCurrentTime(`${hours}:${minutes}:${seconds}`);
  };

  const currency = useMemo(() => {
    if (!tokenType || tokenType === "LTC") return "USDT";
    return tokenType;
  }, [tokenType]);

  const handleGetPrice = async (token: string) => {
    if (token === "BTC" || token === "ETH") {
      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/ticker/price?symbol=${token}USDT`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        updateTime();
        setUsdPrice(Number(Number(result?.price).toFixed(0)) || 0);
      } catch (error) {
        console.log(error);
      }
    } else {
      setUsdPrice(1);
    }
  };

  const handleGetJPYPrice = async () => {
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    updateTime();
    setJPYPrice(Number(Number(data.rates.JPY).toFixed(0)));
  };

  useEffect(() => {
    handleGetJPYPrice();
    handleGetPrice(tokenType);
    const intervalId = setInterval(() => {
      handleGetPrice(tokenType);
    }, 10000);

    return () => clearInterval(intervalId);
  }, [tokenType]);

  const formik = useFormik<FormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      applicationType: "",
      csid: "",
      participantCount: 0,
      cryptoType: "BTC",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("氏名は必須です"),
      lastName: Yup.string().required("姓は必須です"),
      email: Yup.string().email("無効なメールアドレスです").required("メールアドレスは必須です"),
      phone: Yup.string().required("電話番号は必須です"),
      applicationType: Yup.string().required("申し込みプランは必須です"),
      csid: Yup.string().required("CSIDは必須です"),
      participantCount: Yup.number().required("申し込み権利数は必須です").positive().integer(),
      cryptoType: Yup.string().required("仮想通貨を選択してください"),
    }),
    onSubmit: async (values) => {
      if (!Number(jpyValue)) {
        toast("金額を入力してください", { type: "error", theme: "colored" });
        return;
      }
      if (!Number(calcPrice2)) {
        toast("まず計算してください", { type: "error", theme: "colored" });
        return;
      }
      setLoading(true);
      try {
        const response = await fetch("https://6900-104-180-21-85.ngrok-free.app/send-application", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            amount: jpyValue,
            crypto_amount: calcPrice2,
          }),
        });
        setLoading(false);
        toast("申請フォームが正常に送信されました。!", { type: "success", theme: "colored" });
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
    },
  });

  const handleCalc = () => {
    if (!jpyValue || !tokenType) return;

    const usdAmount = Number(jpyValue) / jpyPrice;
    let tokenValue = usdAmount / usdPrice;

    if (tokenValue > 1000) tokenValue = Number(tokenValue.toFixed(0));

    setCalcPrice2(tokenValue);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <TextInput
        label="氏名"
        name="firstName"
        value={formik.values.firstName}
        onChange={formik.handleChange}
        error={formik.touched.firstName && formik.errors.firstName ? formik.errors.firstName : undefined}
      />

      <TextInput
        label="姓（カナ）"
        name="lastName"
        value={formik.values.lastName}
        onChange={formik.handleChange}
        error={formik.touched.lastName && formik.errors.lastName ? formik.errors.lastName : undefined}
      />

      <TextInput
        label="メールアドレス"
        name="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        error={formik.touched.email && formik.errors.email ? formik.errors.email : undefined}
      />

      <TextInput
        label="電話番号"
        name="phone"
        value={formik.values.phone}
        onChange={formik.handleChange}
        error={formik.touched.phone && formik.errors.phone ? formik.errors.phone : undefined}
      />

      <div className="bg-[#F3F3F3] rounded-[16px] px-[32px] py-[24px]">
        <label className="font-bold text-[14px] text-[#212121]">
          申し込みプラン<span className="text-red-500 text-[10px]"> ※必須</span>
        </label>
        <div className="mt-1">
          <label className="mr-4 text-[#212121]">
            <input type="radio" name="applicationType" value="individual" onChange={formik.handleChange} />
            スポーツデータイム
          </label>
          <label className="text-[#212121]">
            <input type="radio" name="applicationType" value="light" onChange={formik.handleChange} />
            ライトプラン
          </label>
        </div>
        <label className="text-[10px] font-light text-[#212121]">
          ※ライトプランは、初回お申し込みのお客様のみ選択可能です。
        </label>
        {formik.touched.applicationType && formik.errors.applicationType ? (
          <div className="text-red-500 mt-1">{formik.errors.applicationType}</div>
        ) : null}
      </div>

      <TextInput
        label="申し込み権利数"
        name="participantCount"
        type="number"
        value={formik.values.participantCount as number}
        onChange={formik.handleChange}
        required
        error={formik.touched.participantCount && formik.errors.participantCount ? formik.errors.participantCount : undefined}
      />

      <TextInput
        label="新同行のCSID"
        name="csid"
        value={formik.values.csid}
        onChange={formik.handleChange}
        error={formik.touched.csid && formik.errors.csid ? formik.errors.csid : undefined}
      />

      <hr />

      <h2 className="mt-6 text-[12px] font-light">ご入金時にご利用いただく仮想通貨をご選択ください。</h2>
      <div className="bg-[#F3F3F3] rounded-[16px] px-[32px] py-[24px]">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className={`py-2 px-4 rounded-md ${
              tokenType === "BTC" ? "bg-[#006EFF] text-white" : "bg-[#E1EFFF]"
            }`}
            onClick={() => setTokenType("BTC")}
          >
            BTC
          </button>
          <button
            type="button"
            className={`py-2 px-4 rounded-md ${
              tokenType === "ETH" ? "bg-[#006EFF] text-white" : "bg-[#E1EFFF]"
            }`}
            onClick={() => setTokenType("ETH")}
          >
            ETH
          </button>
          <button
            type="button"
            className={`py-2 px-4 rounded-md ${
              tokenType === "LTC" ? "bg-[#006EFF] text-white" : "bg-[#E1EFFF]"
            }`}
            onClick={() => setTokenType("LTC")}
          >
            LTC
          </button>
        </div>
        <div className="mt-2">
          <label className="font-bold text-[14px] text-[#212121]">{cryptoLabel[tokenType]}</label>
          <NumericFormat
            className="input-style"
            value={jpyValue}
            onValueChange={(values) => setJpyValue(values.value)}
            thousandSeparator
            prefix="¥"
            decimalScale={0}
          />
        </div>
        <div className="mt-4 flex gap-4">
          <button
            type="button"
            onClick={handleCalc}
            className="py-2 px-4 bg-[#006EFF] text-white rounded-md"
          >
            計算する
          </button>
          <div className="mt-2">
            <p className="font-bold">必要な{tokenType}:</p>
            <p className="font-semibold">{calcPrice2}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="bg-[#F1F1F1] py-2 px-6 rounded-[20px] text-[12px]"
          onClick={() => formik.resetForm()}
        >
          リセット
        </button>
        <button
          type="submit"
          className="bg-[#006EFF] py-2 px-6 rounded-[20px] text-[12px] text-white"
          disabled={loading}
        >
          送信
        </button>
      </div>

      <ToastContainer position="bottom-left" autoClose={3000} />
    </form>
  );
};

export default CombinedForm;
