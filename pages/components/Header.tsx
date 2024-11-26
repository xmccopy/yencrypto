import Image from "next/image";

const HeaderComponent = () => {
  return (
    <div className="flex h-[60px] md:h-[90px] items-center bg-white px-5 md:px-[240px] justify-center">
      <Image
        src="/logo.jpg"
        alt="logo"
        width={200}
        height={30}
        className="w-auto h-[30px] md:h-[50px]"
      />
    </div>
  );
};

export default HeaderComponent;
