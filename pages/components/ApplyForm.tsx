"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import TextInput from "./TextInput";
import { useEffect, useMemo, useState, useCallback } from "react";
import { NumericFormat } from "react-number-format";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface TrackingTokenPriceProps {
  currency: string;
  usdPrice: number;
  jpyPice: number;
  currentTime: string;
}

const adminAddress = "bc1qsdt43n78g6hscvzgp4cjrs2j2sjx5zpufrq09p";

const formatNumber = (number: number) => {
  const formattedNumber = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
  return formattedNumber;
};

const CombinedForm = () => {
  const currency = "BTC";
  const [usdPrice, setPrice] = useState(1);
  const [jpyPice, setJPYPrice] = useState(0);
  const [jpyValue, setJpyValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [calcPrice2, setCalcPrice2] = useState(0);
  const [currentTime, setCurrentTime] = useState("");

  const btcAmount = useMemo(() => {
    if (Number(calcPrice2) > 0) return Number(calcPrice2.toFixed(8));
    return calcPrice2;
  }, [calcPrice2]);

  const updateTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    setCurrentTime(`${hours}:${minutes}:${seconds}`);
  };

  const handleGetPrice = useCallback(async () => {
    try {
      // Use backticks for the template literal
      const response = await fetch(
        `https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT`
      );

      const result = await response.json();
      updateTime(); // Ensure this function is correctly defined elsewhere
      setPrice(Number(result?.price) || 0); // Correct parsing and fallback
    } catch (error) {
      console.log("Error fetching the price:", error); // Use console.error for better debugging
    }
  }, []);

  const handleGetJPYPrice = useCallback(async () => {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/USD`
    );
    const data = await response.json();
    updateTime();
    setJPYPrice(Number(Number(data.rates.JPY).toFixed(0)));
  }, []);

  useEffect(() => {
    handleGetJPYPrice();
    handleGetPrice();

    const intervalId = setInterval(() => {
      handleGetPrice();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [handleGetJPYPrice, handleGetPrice]);

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      applicationType: "",
      csid: "",
      participantCount: null,
      walletAddress: "",
      cryptoType: "BTC",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("氏名は必須です"),
      lastName: Yup.string().required("氏名（カナ）は必須です"),
      email: Yup.string()
        .email("無効なメールアドレスです")
        .required("メールアドレスは必須です"),
      phone: Yup.string().required("電話番号は必須です"),
      applicationType: Yup.string().required("申し込みプランは必須です"),
      csid: Yup.string().optional(),
      participantCount: Yup.number()
        .required("申し込み権利数は必須です")
        .positive(),
      cryptoType: Yup.string().required("仮想通貨を選択してください"),
      walletAddress: Yup.string().required(
        "プライベートウォレットアドレスは必須です"
      ),
      // amount: Yup.number()
      //   .required("金額を入力してください")
      //   .positive()
      //   .integer(),
    }),
    onSubmit: async (values) => {
      if (!Number(jpyValue)) {
        toast("金額を入力してください", {
          type: "error",
          theme: "colored",
        });
        return;
      }
      if (!Number(calcPrice2)) {
        toast("まず計算してください", {
          type: "error",
          theme: "colored",
        });
        return;
      }
      setLoading(true);
      try {
        await fetch(
          "https://6900-104-180-21-85.ngrok-free.app/send-application",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...values,
              amount: jpyValue,
              adminAddress,
              crypto_amount: calcPrice2,
            }),
          }
        );
        setLoading(false);
        toast("申請フォームが正常に送信されました。!", {
          type: "success",
          theme: "colored",
        });
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
      }
      // console.log(values);
    },
  });

  const handleCalc = () => {
    if (!jpyValue) return;

    const usdAmount = Number(jpyValue) / jpyPice;
    let tokenValue = usdAmount / usdPrice;

    if (tokenValue > 1000) tokenValue = Number(tokenValue.toFixed(0));

    setCalcPrice2(tokenValue);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <TextInput
        required
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
        required
        label="氏名（カナ）"
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
        required
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
        required
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

      <div className="bg-[#F3F3F3] rounded-[16px] px-4 md:px-[32px] py-4 md:py-[24px]">
        <label className="font-bold text-[14px] text-[#212121]">
          申し込みプラン<span className="text-red-500 text-[10px]"> ※必須</span>
        </label>
        <div className="mt-1">
          <label className="mr-4 text-[#212121]">
            <input
              type="radio"
              name="applicationType"
              value="individual"
              onChange={formik.handleChange}
            />
            スタンダードプラン
          </label>
          <label className="text-[#212121]">
            <input
              type="radio"
              name="applicationType"
              value="light"
              onChange={formik.handleChange}
            />
            ライトプラン
          </label>
        </div>
        <label className="text-[10px] font-light text-[#212121]">
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
        type="number"
        value={formik.values.participantCount as unknown as number}
        onChange={formik.handleChange}
        required
        need
        error={
          formik.touched.participantCount && formik.errors.participantCount
            ? formik.errors.participantCount
            : undefined
        }
      />

      <div className="px-4 md:px-[32px] py-4 md:py-[24px] bg-[#F3F3F3] rounded-[16px]">
        <div className="flex flex-col gap-3">
          <label
            htmlFor="walletAddress"
            className="font-bold text-[14px] text-[#212121]"
          >
            【配当受取用】<span className="text-red-500 text-[10px]"> ※必須</span>
          </label>
          <label
            htmlFor="walletAddress"
            className="font-bold text-[14px] text-[#212121]"
          >
            お客様のプライベートウォレットBTCアドレス
          </label>
        </div>
        <div className="flex flex-row gap-2 w-full items-center">
          <input
            id="walletAddress"
            name="walletAddress"
            type="text"
            value={formik.values.walletAddress as unknown as number}
            onChange={formik.handleChange}
            className={`mt-1 block py-1 w-full px-2  text-[#212121] bg-[#FEFEFE] rounded-lg ${
              (
                formik.touched.walletAddress && formik.errors.walletAddress
                  ? formik.errors.walletAddress
                  : undefined
              )
                ? "border border-red-500"
                : "border border-[#185F03]"
            }`}
          />
        </div>
        {(formik.touched.walletAddress && formik.errors.walletAddress
          ? formik.errors.walletAddress
          : undefined) && (
          <div className="text-red-500 mt-1">{formik.errors.walletAddress}</div>
        )}
      </div>

      <TextInput
        label="紹介者のCSID"
        name="csid"
        value={formik.values.csid}
        onChange={formik.handleChange}
        error={
          formik.touched.csid && formik.errors.csid
            ? formik.errors.csid
            : undefined
        }
      />
      <div className="bg-[#F3F3F3] rounded-[16px] px-4 md:px-[32px] py-4 md:py-[24px]">
        <label
          htmlFor="cryptoType"
          className="block text-[14px] font-semibold text-[#212121]"
        >
          BTC送金先アドレス
        </label>
        <div className="flex items-center justify-between mt-3">
          <label className="hidden md:block text-[14px] font-light text-[#212121]">
            {adminAddress}
          </label>
          <label className="block md:hidden text-[14px] font-light text-[#212121]">
            {adminAddress.slice(0, 13) + "......." + adminAddress.slice(-10)}
          </label>
          <CopyToClipboard
            text={adminAddress.toString()}
            onCopy={() =>
              toast("Copied to clipboard!", {
                type: "success",
                theme: "colored",
              })
            }
          >
            <button
              type="button"
              className="py-[2px] px-3 bg-[#E2E2E2] p-10 text-[#185F03] rounded-full text-[14px]"
            >
              コピーする
            </button>
          </CopyToClipboard>
        </div>
      </div>

      <div>
        <label className="text-[12px] font-semibold">
          以下に表示されるBTC数量は、お客様が申し込み手続きをされた時点の市場レートで計算されています。
        </label>
      </div>
      <div className="bg-[#F3F3F3] rounded-[16px] px-4 md:px-[32px] py-4 md:py-[24px]">
        <label className="text-[12px] font-semibold text-[#212121]">
          仮想通貨数量を計算
        </label>
        <label className="mt-3 block text-[12px] font-semibold text-[#212121]">
          日本円入金額を入力
        </label>
        <div className="flex flex-row gap-2 items-center mt-2">
          <NumericFormat
            id="numberInput"
            name="amount"
            thousandSeparator={true}
            fixedDecimalScale={true}
            allowNegative={false}
            placeholder="日本円金額を入力"
            value={jpyValue}
            onValueChange={(values) => {
              const { value } = values;
              setJpyValue(value);
            }}
            className={`block w-full p-2 border rounded-md text-[14px] text-[#212121] border-[#185F03]`}
          />
          <span className="text-[#212121]">円</span>
        </div>
        {/* {formik.touched.amount && formik.errors.amount ? (
          <div className="text-red-500 mt-1">{formik.errors.amount}</div>
        ) : null} */}

        <div className="flex items-center gap-2 mt-4 ">
          <button
            type="button"
            className="py-1 px-4 font-semibold bg-gradient-to-r from-[#DBDE7D] to-[#FF7B7B] p-10 text-[#185F03] rounded-full text-[14px]"
            onClick={handleCalc}
          >
            計算する
          </button>
        </div>

        <label className="mt-3 block text-[10px] font-light text-[#212121]">
          ※日本円入金額を入力し、計算するボタンを押してください。
        </label>

        <div>
          <label className="text-[12px] font-semibold text-[#212121]">
            必要なBTC数量
          </label>

          <div className="border border-[#185F03] rounded-lg h-[39px] w-full bg-[#FEFEFE] px-[12px] flex items-center justify-between">
            <p className="text-[12px] text-[#212121] font-semibold">
              {btcAmount}
            </p>
            <CopyToClipboard
              text={btcAmount.toString()}
              onCopy={() =>
                toast("Copied to clipboard!", {
                  type: "success",
                  theme: "colored",
                })
              }
            >
              <button
                type="button"
                className="py-[2px] px-3 bg-[#E2E2E2] p-10 text-[#185F03] rounded-full text-[14px]"
              >
                コピーする
              </button>
            </CopyToClipboard>
          </div>
        </div>
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
          className="mt-3 py-2 px-4 bg-gray-700 text-white rounded-md w-[160px] items-center justify-center flex"
        >
          {loading ? (
            <svg
              aria-hidden="true"
              className="w-[24px] h-[24px] text-gray-200 animate-spin dark:text-gray-600 fill-white"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          ) : (
            "申し込み内容送信"
          )}
        </button>
      </div>
      <ToastContainer />
    </form>
  );
};

const TrackingTokenPrice = ({
  currency,
  usdPrice,
  jpyPice,
  currentTime,
}: TrackingTokenPriceProps) => {
  const calcJPYPrice = useMemo(() => usdPrice * jpyPice, [usdPrice, jpyPice]);

  return (
    <div className="mt-4 text-[12px] font-light">
      <p>
        1 {currency} = ¥{formatNumber(calcJPYPrice)}
      </p>
      <p>【レート取得時刻】{currentTime}</p>
    </div>
  );
};

export default CombinedForm;
