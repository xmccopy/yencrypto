"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import TextInput from "./TextInput";
import { useEffect, useMemo, useState } from "react";

interface TrackingTokenPriceProps {
  currency: string;
  usdPrice: number;
  jpyPice: number;
  currentTime: string;
}

const CombinedForm = () => {
  const [tokenType, setTokenType] = useState("");
  const [usdPrice, setPrice] = useState(1);
  const [jpyPice, setJPYPrice] = useState(0);
  const [calcPrice1, setCalcPrice1] = useState(0);
  const [calcPrice2, setCalcPrice2] = useState(0);
  const [currentTime, setCurrentTime] = useState("");

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
      const response = await fetch(
        `https://api.binance.com/api/v3/ticker/price?symbol=${
          token ? token + "USDT" : "BTCUSDT"
        }`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      updateTime();
      setPrice(Number(Number(result?.price).toFixed(0)) || 0);
    } else {
      setPrice(1);
    }
  };

  const handleGetJPYPrice = async () => {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/USD`
    );
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

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      applicationType: "",
      csid: "",
      participantCount: "",
      cryptoType: "",
      amount: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("氏名は必須です"),
      lastName: Yup.string().required("姓は必須です"),
      email: Yup.string()
        .email("無効なメールアドレスです")
        .required("メールアドレスは必須です"),
      phone: Yup.string().required("電話番号は必須です"),
      applicationType: Yup.string().required("申し込みプランは必須です"),
      csid: Yup.string().required("CSIDは必須です"),
      participantCount: Yup.number()
        .required("申し込み権利数は必須です")
        .positive()
        .integer(),
      cryptoType: Yup.string().required("仮想通貨を選択してください"),
      amount: Yup.number()
        .required("金額を入力してください")
        .positive()
        .integer(),
    }),
    onSubmit: (values) => {
      // Handle form submission
      console.log(values);
    },
  });

  const handleCalc = () => {
    if (!formik.values.amount || !tokenType) return;

    const usdAmount = Number(formik.values.amount) / jpyPice;
    let tokenValue = usdAmount / usdPrice;

    if (tokenValue > 1000) tokenValue = Number(tokenValue.toFixed(0));

    setCalcPrice1(Number(formik.values.amount));
    setCalcPrice2(tokenValue);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <TextInput
        label="氏名"
        name="firstName"
        value={formik.values.firstName}
        onChange={formik.handleChange}
        error={
          formik.touched.firstName && formik.errors.firstName
            ? formik.errors.firstName
            : undefined
        }
      />

      <TextInput
        label="姓（カナ）"
        name="lastName"
        value={formik.values.lastName}
        onChange={formik.handleChange}
        error={
          formik.touched.lastName && formik.errors.lastName
            ? formik.errors.lastName
            : undefined
        }
      />

      <TextInput
        label="メールアドレス"
        name="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        error={
          formik.touched.email && formik.errors.email
            ? formik.errors.email
            : undefined
        }
      />

      <TextInput
        label="電話番号"
        name="phone"
        value={formik.values.phone}
        onChange={formik.handleChange}
        error={
          formik.touched.phone && formik.errors.phone
            ? formik.errors.phone
            : undefined
        }
      />

      <div className="mb-4 p-4 bg-gray-300">
        <label className="font-bold text-[14px]">
          申し込みプラン<span className="text-red-500 text-[10px]"> ※必須</span>
        </label>
        <div className="mt-1">
          <label className="mr-4">
            <input
              type="radio"
              name="applicationType"
              value="individual"
              onChange={formik.handleChange}
            />
            スポーツデータイム
          </label>
          <label>
            <input
              type="radio"
              name="applicationType"
              value="light"
              onChange={formik.handleChange}
            />
            ライトプラン
          </label>
        </div>
        <label className="text-[10px] font-light">
          ※ライトプランは、初回お申し込みのお客様のみ選択可能です。
        </label>
        {formik.touched.applicationType && formik.errors.applicationType ? (
          <div className="text-red-500 mt-1">
            {formik.errors.applicationType}
          </div>
        ) : null}
      </div>

      <TextInput
        label="申し込み権利数"
        name="participantCount"
        value={formik.values.participantCount as unknown as string}
        onChange={formik.handleChange}
        required
        need
        error={
          formik.touched.participantCount && formik.errors.participantCount
            ? formik.errors.participantCount
            : undefined
        }
      />

      <TextInput
        label="新同行のCSID"
        name="csid"
        value={formik.values.csid}
        onChange={formik.handleChange}
        error={
          formik.touched.csid && formik.errors.csid
            ? formik.errors.csid
            : undefined
        }
      />

      <hr />

      <h2 className="mt-6 text-[12px] font-light">
        ご入金時にご利用いただく仮想通貨をご選択ください。
      </h2>
      <div className="mb-4 p-4 bg-gray-300">
        <label htmlFor="cryptoType" className="block text-[14px] font-semibold">
          仮想通貨
        </label>
        <select
          id="cryptoType"
          name="cryptoType"
          value={formik.values.cryptoType}
          onChange={(e) => {
            setCalcPrice1(0);
            setTokenType(e.target.value);
            formik.handleChange(e);
          }}
          className={`mt-2 block w-full p-2 border rounded-md text-[14px] ${
            formik.touched.cryptoType && formik.errors.cryptoType
              ? "border-red-500"
              : "border-gray-300"
          }`}
        >
          <option value="" className="text-[14px]">
            選択してください
          </option>
          <option value="BTC" className="text-[14px]">
            ビットコイン (BTC)
          </option>
          <option value="ETH" className="text-[14px]">
            イーサリアム (ETH)
          </option>
          <option value="LTC" className="text-[14px]">
            テザー (USDT)
          </option>
        </select>
        {formik.touched.cryptoType && formik.errors.cryptoType ? (
          <div className="text-red-500 mt-1">{formik.errors.cryptoType}</div>
        ) : null}
      </div>
      <div>
        <label className="text-[12px] font-semibold">
          仮想通貨入金額は、お客様が申し込み手続きをされた時点
          の市場レートで計算されます。
        </label>
      </div>
      <div className="mb-4 p-4 bg-gray-300">
        <label className="text-[12px] font-semibold">仮想通貨数量を計算</label>
        <label className="mt-3 block text-[12px] font-semibold">
          日本円入金額を入力
        </label>
        <div className="flex flex-row gap-1 items-end">
          <input
            id="amount"
            name="amount"
            type="number"
            value={formik.values.amount}
            onChange={formik.handleChange}
            placeholder="日本円金額を入力"
            className={`mt-2 block w-full p-2 border rounded-md text-[14px] ${
              formik.touched.amount && formik.errors.amount
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          <span>円</span>
        </div>
        {formik.touched.amount && formik.errors.amount ? (
          <div className="text-red-500 mt-1">{formik.errors.amount}</div>
        ) : null}

        <div className="flex items-center gap-2 mt-4 ">
          <button
            type="button"
            className="py-1 px-4 bg-gradient-to-r from-[#c27070] to-[#0dad0d] p-10 text-white rounded-full text-[12px]"
            onClick={handleCalc}
          >
            計算する
          </button>
          {calcPrice1 ? (
            <p className="text-[12px] font-light">
              {calcPrice1} 円 = {calcPrice2} {currency}
            </p>
          ) : null}
        </div>

        <label className="mt-3 block text-[10px] font-light">
          ※日本円入金額を入力し、計算するボタンを押してください。
        </label>

        <label className="mt-3 block text-[12px] font-light">
          仮想通貨入金額は、お客様が申し込み手続きされた時点の市場
          レートで計算されます。
        </label>
      </div>

      <TrackingTokenPrice
        currency={currency}
        usdPrice={usdPrice}
        jpyPice={jpyPice}
        currentTime={currentTime}
      />

      <div className="flex justify-center">
        <button
          type="submit"
          className="mt-3 py-2 px-4 bg-gray-700 text-white rounded-md"
        >
          申し込み内容送信
        </button>
      </div>
    </form>
  );
};

const TrackingTokenPrice = ({
  currency,
  usdPrice,
  jpyPice,
  currentTime
}: TrackingTokenPriceProps) => {
  const calcJPYPrice = useMemo(() => usdPrice * jpyPice, [usdPrice, jpyPice]);

  return (
    <div className="mt-4 text-[12px] font-light">
      <p>
        1 {currency} = ¥{calcJPYPrice}
      </p>
      <p>【レート取得時刻】{currentTime}</p>
    </div>
  );
};

export default CombinedForm;
