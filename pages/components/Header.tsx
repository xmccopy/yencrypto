const HeaderComponent = () => {
  return (
    <div className="flex h-[90px] items-center bg-white px-5 md:px-[240px] justify-between">
      <img src="/logo.jpg" className="h-[30px] md:h-[50px]" />
      <div className="flex items-center w-[150px] md:w-[193px] h-[50px] md:h-[58px] rounded-[50px] border-[#185F03] border-[1px]">
        <img src="/user.png" className="h-[50px] md:h-[58px]" />
        <p className="text-center w-full text-[16px] md:text-[20px]">高橋 文哉</p>
      </div>
    </div>
  );
};

export default HeaderComponent;
